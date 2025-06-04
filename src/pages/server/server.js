import express from "express";
import "./db/connection.js";
import { getClient,addClient } from "./controllers/client-controller.js";
import { sendTransaction, confirmTransaction } from "./controllers/transaction-controller.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/client", getClient);
app.post("/client", addClient);

app.post("/transaction/send", sendTransaction);
app.post("/transaction/confirm", confirmTransaction);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});