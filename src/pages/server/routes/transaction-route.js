import { confirmTransaction, sendTransaction } from "../controllers/transaction-controller";

export default async function handler(req, res) {
  try {
    switch (req.method) {
        case "GET":
          break;
      case "POST":
        return await sendTransaction(req, res);
      case "PUT":
        return await confirmTransaction(req, res);
      case "DELETE":
        break;
      default:
        res.status(405).json({ message: "Method not Allowed" });
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
