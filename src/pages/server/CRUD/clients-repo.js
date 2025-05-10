import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, query, where } from "firebase/firestore";

export const clientsRepo = {
  _addClient,
  _getClientById,
};

const collectionRef = collection(db, "clients");

async function _addClient(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is required' });
  }

  try {
    const clientData = {
      identification: 
      String(req.body.identification || ''),
      name: String(req.body.name || ''),
      email: String(req.body.email || ''),
      phone: String(req.body.phone || ''),
      password: String(req.body.password || ''),
      balance: 10000,
      createdAt: new Date()
    };

    await addDoc(collectionRef, clientData);
    
    return res.status(201).json({ 
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Firestore error:', error);
    return res.status(400).json({ 
      message: 'Failed to create client',
      error: error.message 
    });
  }
}

async function _getClientById(req, res) {
  const { identification } = req.body;
  try {
    const ref = doc(db, "clients", identification);
    const client = query(ref, where("identification", "==", identification));
    const data = (await getDoc(client)).data();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: "Client not Found" });
  }
}
