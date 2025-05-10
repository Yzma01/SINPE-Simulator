import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const clientsRepo = {
  _addClient,
  _getClient,
};

const collectionRef = collection(db, "clients");

async function _addClient(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is required" });
  }

  try {
    const clientData = {
      identification: String(req.body.identification || ""),
      name: String(req.body.name || ""),
      email: String(req.body.email || ""),
      phone: String(req.body.phone || ""),
      password: String(req.body.password || ""),
      balance: 10000,
      createdAt: new Date(),
    };

    await addDoc(collectionRef, clientData);

    return res.status(201).json({
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return res.status(400).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
}

async function _getClient(req, res) {
  const { password, identification } = req.body;
  try {
    const clientsRef = collection(db, "clients");
    const clients = query(
      clientsRef,
      where("identification", "==", identification),
      where("password", "==", password)
    );
    const snapshots = await getDocs(clients);
    if (!snapshots.empty) {
      const snapshot = snapshots.docs[0];
      const data = snapshot.data();
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(404).json({ message: "Client not Found" });
  }
}
