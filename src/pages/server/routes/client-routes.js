import { addClient } from "../controllers/client-controller";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    switch (req.method) {
      //   case "GET":
      //     if (id) await getClientById(req, res);
      //     else await getClients(req, res);
      //     break;
      case "POST":
        return await addClient(req, res);
      case "PUT":
        break;
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
