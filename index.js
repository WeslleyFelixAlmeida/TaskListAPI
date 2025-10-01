require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const server = express();

// Configurações globais
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// CORS - usa variáveis de ambiente para flexibilidade
server.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Rotas
const UserRoutes = require('./Routes/UserRoutes');
server.use(UserRoutes);

const TaskRoutes = require("./Routes/TaskRoutes");
server.use(TaskRoutes);

// Porta dinâmica para Vercel, ou 5050 local
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
