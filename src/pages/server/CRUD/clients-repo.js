import { db } from "@/lib/firebase";
import { collection, addDoc, doc } from "firebase/firestore";

export const clientsRepo = {
  _addClient,
  _getClientById,
};

const collectionRef = collection(db, "clients");

async function _addClient(req, res) {
  try {
    const client = await addDoc(collectionRef, req.body);
    res.status(200).json({ id: client.id });
  } catch (e) {
    res.status(500).json({ message: "Error creating user ", e });
  }
}

async function _getClientById(req, res) {
  const { identification } = req.body;
  try {
    const client = doc(db, "clients", identification);
    return res.status(200).json(client);
  } catch (error) {
    return res.status(404).json({ message: "Client not Found" });
  }
}
