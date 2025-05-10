import transactionRoutes from '@/pages/server/routes/transaction-route.js';


export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
    if(req.method === 'OPTIONS'){
        return res.status(200).end();
    }

    try {
        await transactionRoutes(req, res);
    }catch (error){
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}