import { makeFetch } from "../../src/app/utils/fetch.js";
import { db } from "../db/connection.js";
import { serverFetch } from "../utils/serverFetch.js";
import {
  createTransactionToken,
  verifyTransactionToken,
} from "../utils/token.js";

export const transactionsRepo = {
  _sendTransaction,
  _confirmTransaction,
  _reciveTransaction,
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

  const recipient = await db.Clients.findOne({
    cli_phone: body.recipientPhone,
  });

  if (!recipient) {
    const status = await _sendTransactionToOtherBank(body, res);
    const message = _verifyStatus(status);
    return res.status(status).json({ message: message });
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

async function _sendTransactionToOtherBank(body) {
  const prefix = body.recipientPhone.substring(0, 2);

  const responseDestinationBank = await serverFetch(
    process.env.GET_API_KEY_URL,
    "GET",
    prefix
  );

  const destinationBankData = await responseDestinationBank.json();
  console.log("destino: ", destinationBankData);

  const responseIssuingBank = await serverFetch(
    process.env.GET_API_KEY_URL,
    "GET",
    process.env.LOCAL_PREFIX
  );

  const issuingBankData = await responseIssuingBank.json();
  console.log("emisor: ", issuingBankData);

  const newBody = {
    num_emisor: body.emisorPhone,
    key_emisor: issuingBankData.api_key,
    monto: body.amount,
    num_receptor: body.recipientPhone,
    detalle: body.details,
    fecha: new Date(),
  };

  const response = await serverFetch(
    destinationBankData.route,
    "POST",
    "",
    newBody
  );

  if (response.status == 200) {
    const client = await db.Clients.findOne({ cli_id: body.clientId });
    const updateResponse = await updateBalance(body.amount * -1, client);
    if(updateResponse && updateResponse.status !== 200) return updateResponse.status;
  }

  return response.status;
}

async function _confirmTransaction(req, res) {
  const { token } = req.body;
  const payload = verifyTransactionToken(token);

  if (!payload) {
    return res
      .status(498)
      .json({ message: "Invalid Token or already expired" });
  }

  const { clientId, recipientId, lastClientBalance, amount, body } = payload;

  const client = await db.Clients.findOne({ cli_id: clientId });

  console.log("client: ", client);

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  if (lastClientBalance != client.cli_balance) {
    return res.status(226).json({ message: "Token already used" });
  }

  const recipient = await db.Clients.findOne({ cli_id: recipientId });

  console.log("recipient: ", recipient);

  if (!recipient) {
    return res.status(523).json({ message: "Recipient not found" });
  }

  if (!canMakeTransaction(client.cli_balance, amount)) {
    return res.status(507).json({ message: "Not enough money" });
  }

  await updateBalance(amount * -1, client);

  await updateBalance(amount, recipient);

  const transaction = new db.Transactions({
    tra_num_emisor: body.emisorPhone,
    tra_num_receptor: body.recipientPhone,
    tra_amount: body.amount,
    tra_details: body.details,
    tra_date: new Date(),
  });

  await transaction.save();

  return res
    .status(214)
    .json({ message: "transaction succesfully", voucher: transaction });
}

async function updateBalance(amount, account) {
  try {
    const data = await db.Clients.findOne({ cli_id: account.cli_id });

    if (!data) {
      throw { status: 404, message: "Client not found" };
    }

    data.cli_balance = data.cli_balance + amount;

    await data.save();
    throw { status: 200 };
  } catch (error) {
    throw {
      status: 304,
      error: error.message,
      message: "No se pudo modificar los datos del cliente",
    };
  }
}

async function _reciveTransaction(req, res) {
  console.log(req.body);
  if (await !bankIsValid(req.body)) {
    return res.status(400).json({ status: 500, message: "Api key no válida" });
  }
  const client = await db.Clients.findOne({
    cli_phone: req.body.num_receptor,
  });

  if (!client) {
    return res.status(404).json({ status: 404, message: "client not found" });
  }

  await updateBalance(req.body.monto, client);

   console.log("client", client);

  res
    .status(200)
    .json({ status: 200, message: "Tranferencia recibida correctamente." });
}

async function bankIsValid(body) {
  const prefix = body.num_receptor.substring(0, 2);
  const response = await serverFetch(
    process.env.GET_API_KEY_URL,
    "GET",
    prefix
  );
  const data = await response.json();
  if (body.key_emisor === data.api_key) {
    return true;
  }
  return false;
}

function canMakeTransaction(balance, amount) {
  if (balance == 0 || balance < 0) return false;
  if (amount > balance) return false;
  return true;
}

function _verifyStatus(status) {
  switch (status) {
    case 200:
      return "Transferencia enviada con éxito.";
    case 404:
      return "Client not found";
    case 304:
      return "No se puedo modificar los datos del cliente";
    case 500:
      return "Internal server error";
  }
}
