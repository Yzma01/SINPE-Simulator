import mongoose from "mongoose";
import { Client, Transaction} from "./models.js";

mongoose
  .connect("mongodb://localhost:27017/romar") //!luego meter en .env
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


export const db = {
    Clients: Client,
    Transactions: Transaction
}

export default mongoose;