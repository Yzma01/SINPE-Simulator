import express from "express";
import "./db/connection.js";
import { getClient, addClient } from "./controllers/client-controller.js";
import {
  sendTransaction,
  confirmTransaction,
} from "./controllers/transaction-controller.js";
import https from "https";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

const privateKey = fs.readFileSync("../key.pem", "utf8");
const certificate = fs.readFileSync("../cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

app.use(express.json());

app.get("/client", getClient);
app.post("/client", addClient);

app.post("/transaction/send", sendTransaction);
app.post("/transaction/confirm", confirmTransaction);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
