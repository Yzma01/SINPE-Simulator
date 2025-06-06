import { increment } from "firebase/firestore";
import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  cli_id: { type: String, unique: true, required: true },
  cli_name: { type: String, required: true },
  cli_lastname: { type: String, required: true },
  cli_phone: { type: String, required: true },
  cli_balance: { type: Number, required: true },
  cli_email: { type: String, required: true },
  cli_password: { type: String, required: true },
});

const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export { Client };

const TransactionSchema = new mongoose.Schema({
  tra_num_emisor: { type: String, required: true },
  tra_num_receptor: { type: String, required: true },
  tra_amount: { type: Number, required: true },
  tra_details: { type: String, required: true },
  tra_date: { type: Date, required: true },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export { Transaction };
