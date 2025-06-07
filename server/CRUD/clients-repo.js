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

    clientExists(cli_id, res);
    phoneExists(cli_password, res);
    emailExist(cli_email, res);

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
    return res.status(500).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
}

async function clientExists(id, res) {
  const existingClient = await db.Clients.findOne({ cli_id: id });
  if (existingClient) {
    return res.status(208).json({ message: "Client already exists" });
  }
}

async function phoneExists(phone, res) {
  const existingPhone = await db.Clients.find({ cli_phone: phone });
  if (existingPhone) {
    return res.status(207).json({ message: "Phone already exists." });
  }
}

async function emailExist(email, res) {
  const existingEmail = await db.Clients.find({ cli_email: email });
  if (existingEmail) {
    return res.status(226).json({ message: "Email already exists." });
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
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
