import { transactionsRepo } from "../CRUD/transactions-repo.js";

export const sendTransaction = async (req, res)=>{
    await transactionsRepo._sendTransaction(req, res);
}

export const confirmTransaction = async (req, res)=>{
    await transactionsRepo._confirmTransaction(req,res);
}

export const reciveTransaction = async (req, res)=>{
    await transactionsRepo._reciveTransaction(req, res);
}