import { transactionsRepo } from "../CRUD/transactions-repo";

export const sendTransaction = async (req, res)=>{
    await transactionsRepo._sendTransaction(req, res);
}

export const confirmTransaction = async (req, res)=>{
    await transactionsRepo._confirmTransaction(req,res);
}