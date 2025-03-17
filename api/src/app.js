import express from "express";
import cors from "cors";
import { getAllUsers, login, registerUsers } from "./Controllers/UsersController.js";
import { createCard, getCardBalance, getCardsByUser, rechargeBalance } from "./Controllers/CardController.js";
import { createTransaction, getTransactionsByCard, transferBalance, updateTransactionStatus } from "./Controllers/TransactionController.js";


//servidor
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(_req, res)=>{
    res.send("hola desde servidor js")
})

//endpoints
// Endpoints de usuarios
app.post("/api/auth/register", registerUsers); // Registrar un nuevo usuario
app.post("/api/auth/login", login); // Iniciar sesión
app.get("/api/users", getAllUsers); // Obtener todos los usuarios

// Endpoints de tarjetas
app.post("/api/cards", createCard); // Crear una nueva tarjeta
app.get("/api/cards/user/:userId", getCardsByUser); // Obtener tarjetas de un usuario
app.post("/api/cards/recharge", rechargeBalance); // Recargar saldo en una tarjeta
app.get("/api/cards/balance/:cardId", getCardBalance); // Obtener el saldo de una tarjeta
app.post("/api/cards/transfer", transferBalance); // Transferir saldo entre tarjetas

// Endpoints de transacciones
app.post("/api/transactions", createTransaction); // Crear una nueva transacción
app.get("/api/transactions/card/:cardId", getTransactionsByCard); // Obtener transacciones de una tarjeta
app.put("/api/transactions/:transactionId", updateTransactionStatus); // Actualizar el estado de una transacción




export default app;