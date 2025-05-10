import { clientsRepo } from "@/pages/server/CRUD/clients-repo.js";

export const getClient = async (req, res) => {
  await clientsRepo._getClient(req, res);
};

export const addClient = async (req, res) => {
  await clientsRepo._addClient(req, res);
};
