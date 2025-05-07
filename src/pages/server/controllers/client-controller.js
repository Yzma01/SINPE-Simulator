import {clientsRepo} from '@/pages/server/CRUD/clients-repo.js';

export const getClientById=(req, res)=>{
    clientsRepo._getClients(req,res);
}

export const addClient = (req, res)=>{
    clientsRepo._addClient(req, res);
}