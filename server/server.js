import express from "express";
import cors from "cors";
import "./db/connection.js";
import { getClient, addClient } from "./controllers/client-controller.js";
import {
  sendTransaction,
  confirmTransaction,
  reciveTransaction,
} from "./controllers/transaction-controller.js";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

const privateKey = fs.readFileSync("../key.pem", "utf8");
const certificate = fs.readFileSync("../cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

// const certs = {
//   key: fs.readFileSync(path.join(__dirname, 'certs/localhost-key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'certs/localhost.pem'))
// };

app.use(express.json());

app.put("/client", getClient);
app.post("/client", addClient);

app.post("/transaction/send", sendTransaction);
app.post("/transaction/confirm", confirmTransaction);

app.post("/recibir-sinpe", reciveTransaction)

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
