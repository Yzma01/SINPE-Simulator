import { clientsRepo } from "@/pages/server/CRUD/clients-repo.js";

export const getClientById = async (req, res) => {
  await clientsRepo._getClients(req, res);
};

export const addClient = async (req, res) => {
  await clientsRepo._addClient(req, res);
};
