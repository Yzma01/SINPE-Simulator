import { makeFetch } from "../../src/app/utils/fetch.js";
import { db } from "../db/connection.js";

export const transactionsRepo = {
  _sendTransaction,
  _confirmTransaction,
};

{
  /*
    Status codes: 
        //! 204 not content (body)
        //! 404 no user found
        //! 507 not enough money
        //! 202 transaction accepted
        //! 403 token already used
        //! 214 transaction applied
    Routes:[
        {
            "route": "api/transaction",
            "method": "POST",
            "body": {
                "clientId": "0",
                "amount":1000,
                "recipientPhone": "00000000"
                },
            "response": {
                "message": "transaction accepted waiting for confirmation",
                "client": {
                    "name": "jorge",
                    "id": "1",
                    "phone": 2000
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjEiLCJyZWNpcGllbnRJZCI6IjIiLCJhbW91bnQiOjEwMDAsImxhc3RDbGllbnRCYWxhbmNlIjoyMDAwLCJib2R5Ijp7ImNsaWVudElkIjoiMSIsImFtb3VudCI6MTAwMCwicmVjaXBpZW50UGhvbmUiOiI1In0sImlhdCI6MTc0NjgyMTI2MywiZXhwIjoxNzQ2ODIxNTYzfQ.40OrZwn0QTWJd_k9jbVQE_RkCNa_vOXaLIuVB6B0b5M",
                "recipient": {
                    "name": "jorge",
                    "phone": "5"
                }
            }
        },
        {
            "route": "api/transaction",
            "method": "PUT",
            "body": {
                "token": "..."
                },
             "response":{
                "message": "transaction succesfully",
                "voucher": {
                    "trasaction": {
                        "clientId": "1",
                        "amount": 1000,
                        "recipientPhone": "5"
                    },
                    "lastClientBalance": 1000,
                    "recipientId": "2",
                    "createAt": "2025-05-09T20:16:48.430Z"
                }
            }  
        },
    ]
*/
}

async function _sendTransaction(req, res) {
  const body = req.body;

  if (!body) {
    return res.status(204).json({ message: "Request body required" });
  }

  const client = await db.Clients.findOne({ cli_id: body.clientId });

  if (!client) {
    return res.status(404).json({ message: "client not found" });
  }

  const recipient = await db.Clients.findOne({ cli_phone: body.num_receptor });

  if (!recipient) {
    const status = await _sendTransactionToOtherBank(body, recipient); 
  }

  if (!canMakeTransaction(client.cli_balance, body.amount)) {
    return res.status(507).json({ message: "Not enough money" });
  }

  const token = createTransactionToken({
    clientId: client.cli_id,
    recipientId: recipient.cli_id,
    amount: body.amount,
    lastClientBalance: client.cli_balance,
    body: body,
  });

  return res.status(202).json({
    message: "transaction accepted waiting for confirmation",
    client: {
      name: client.cli_name,
      id: client.cli_id,
      phone: client.cli_phone,
      balance: client.cli_balance,
    },
    token: token,
    recipient: {
      name: recipient.cli_name,
      id: recipient.cli_id,
      phone: recipient.cli_phone,
    },
  });
}

async function _sendTransactionToOtherBank(body, recipient) {
  //! enviar afuera
    // TODO sacar el prefijo del número 69xxxxxxxx
    // TODO sacar la ruta del banco con https://[ip]/get_api_key/[prefijo]
    // TODO Agregar el api_key del banco emisor, nuestro banco, al body de la petición
    // TODO enviar la petición a la ruta

    const prefix = getPrefix(recipient.cli_phone);
    console.log("prefijo: ",prefix)

    const responseDestinationBank = await makeFetch(process.env.NEXT_PUBLIC_GET_API_KEY_URL, "GET", prefix);
    const destinationBankData = await responseDestinationBank.json();
    console.log("destino: ",destinationBankData);

    const responseIssuingBank = await makeFetch(process.env.NEXT_PUBLIC_GET_API_KEY_URL, "GET", process.env.NEXT_PUBLIC_LOCAL_PREFIX);
    const issuingBankData = await responseIssuingBank.json();
    console.log("emisor: ",issuingBankData);

    const newBody = {...body, key_emisor: issuingBankData.api_key};
    console.log("newbody: ",newBody);
    
    const response = await makeFetch(destinationBankData.route, "POST", "", newBody);
    if(response.status == 200){
      //guardar transacción
      return res.status(404).json({message: "Money Sent"});
    }
    return res.status(500).json({ message: "Internal Server Error" });
}

function getPrefix(phone){
  return phone.substring(0,1);
}

async function _confirmTransaction(req, res) {
  const { token } = req.body;
  const payload = verifyTransactionToken(token);

  if (!payload) {
    return res
      .status(400)
      .json({ message: "Invalid Token or already expired" });
  }

  const { clientId, recipientId, lastClientBalance, amount, body } = payload;

  const client = await db.Clients.findOne({ cli_id: clientId });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  // if (used) {
  //   return res.status(403).json({ message: "Token already used" });
  // }

  if (lastClientBalance != client.cli_balance) {
    return res.status(403).json({ message: "Token already used" });
  }

  const recipient = await db.Clients.findOne({ cli_id: recipientId });

  if (!recipient) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  if (!canMakeTransaction(client.cli_balance, amount)) {
    return res.status(507).json({ message: "Not enough money" });
  }

  await updateBalance(amount * -1, client);

  await updateBalance(amount, recipient);

  const transaction = {
    tra_num_emisor: body.tra_num_emisor,
    tra_num_receptor: body.num_receptor,
    tra_amount: body.monto,
    tra_details: body.detalle,
    tra_date: new Date(),
  };

  await transaction.save();

  return res
    .status(214)
    .json({ message: "transaction succesfully", voucher: transaction });
}

async function updateBalance(amount, account) {
  try {
    const data = await db.Clients.findOne({ cli_id: account.cli_id });

    if (!data) {
     return res.status(404).json({ message: "Client not found" });
    }

  data.cli_balance = data.cli_balance + amount;

  await aux.save();

  } catch (error) {
    throw {
      status: 404,
      message: "No se pudo modificar los daos del cliente"
    }
  }
}

function canMakeTransaction(balance, amount) {
  if (balance == 0 || balance < 0) return false;
  if (amount > balance) return false;
  return true;
}
