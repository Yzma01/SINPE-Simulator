import { addClient, getClient } from "../controllers/client-controller";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        return await addClient(req, res);
      case "PUT":
        return await getClient(req, res);
      default:
        res.status(405).json({ message: "Method not Allowed" });
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
