import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export const clientsRepo = {
  _addClient,
};

const collectionRef = collection(db, 'clients');

async function _addClient(req, res) {
  try {
    const client = await addDoc(collectionRef, req.body);
    res.status(200).json({ id: client.id });
  } catch (e) {
    res.status(500).json({ message: "Error creating user ", e });
  }
}
