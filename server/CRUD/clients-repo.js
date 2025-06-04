import { db } from "../db/connection.js";
export const clientsRepo = {
  _addClient,
  _getClient,
};

const INITIAL_BALANCE = 6996;

async function _addClient(req, res) {
  if (!req.body) {
    return res.status(204).json({ message: "Request body is required" });
  }

  try {
    const {
      cli_id,
      cli_nombre,
      cli_apellido,
      cli_telefono,
      cli_email,
      cli_password,
    } = req.body;

    const existingClient = await db.Clients.findOne({ cli_id });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const newClient = new db.Clients({
      cli_id,
      cli_name: cli_nombre,
      cli_lastname: cli_apellido,
      cli_phone: cli_telefono,
      cli_balance: INITIAL_BALANCE,
      cli_email,
      cli_password,
    });

    await newClient.save();
    return res.status(201).json(newClient);

  } catch (error) {
    console.error("Mongoose error:", error);
    return res.status(400).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
}

async function _getClient(req, res) {
  const { password, identification } = req.body;
  try {
    const client = await db.Clients.findOne({
      cli_password: password,
      cli_id: identification,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(404).json({ message: "Client not Found" });
  }
}
