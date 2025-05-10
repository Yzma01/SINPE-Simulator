import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createTransactionToken, verifyTransactionToken } from "../utils/token";

export const transactionsRepo = {
  _sendTransaction,
  _confirmTransaction,
};

const collectionRef = collection(db, "transactions");

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

  const client = await getData("clients", body.clientId, true);
  if (verifyData(client))
    return res.status(404).json({ message: "client not found" });

  const recipient = await getData("clients", body.recipientPhone, false);
  if (verifyData(recipient))
    return res.status(404).json({ message: "recipient not found" });

  if (!canMakeTransaction(client.data.balance, body.amount)) {
    return res.status(507).json({ message: "Not enough money" });
  }
  const token = createTransactionToken({
    clientId: client.data.identification,
    recipientId: recipient.data.identification,
    amount: body.amount,
    lastClientBalance: client.data.balance,
    body: body,
  });

  return res.status(202).json({
    message: "transaction accepted waiting for confirmation",
    client: {
      name: client.data.name,
      id: client.data.identification,
      phone: client.data.balance,
    },
    token: token,
    recipient: {
      name: recipient.data.name,
      id: recipient.data.id,
      phone: recipient.data.phone,
    },
  });
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

  const client = await getData("clients", clientId, true);
  if (verifyData(client)) {
    return res.status(404).json({ message: "Client not found" });
  }
  if (lastClientBalance != client.data.balance) {
    return res.status(403).json({ message: "Token already used" });
  }

  const recipient = await getData("clients", recipientId, true);
  if (verifyData(recipient)) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  if (!canMakeTransaction(client.data.balance, amount)) {
    return res.status(507).json({ message: "Not enough money" });
  }

  await updateBalance(amount * -1, client.ref, client.data);
  await updateBalance(amount, recipient.ref, recipient.data);
  const transaction = {
    trasaction: body,
    lastClientBalance: client.data.balance,
    recipientId: recipient.data.identification,
    createAt: new Date(),
  };
  await addDoc(collectionRef, transaction);
  return res
    .status(214)
    .json({ message: "transaction succesfully", voucher: transaction });
}

function verifyData(data) {
  if (!data.ref || !data.data) {
    return true;
  }
  return false;
}

async function getData(collectionName, id, client) {
  const ref = collection(db, collectionName);
  let clients;
  if (client) {
    clients = query(ref, where("identification", "==", id));
  } else {
    clients = query(ref, where("phone", "==", id));
  }
  const snapshots = await getDocs(clients);

  if (!snapshots.empty) {
    const snapshot = snapshots.docs[0];
    const data = snapshot.data();
    const docRef = snapshot.ref;
    return { ref: docRef, data: data };
  }
  return null;
}

async function updateBalance(amount, ref, data) {
  await updateDoc(ref, { balance: data.balance + amount });
}

function canMakeTransaction(balance, amount) {
  if (balance == 0 || balance < 0) return false;
  if (amount > balance) return false;
  return true;
}
