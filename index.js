require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Configuração de CORS para qualquer origem
const corsOptions = {
  origin: true, // aceita qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.use(cors(corsOptions));

// Responder corretamente à preflight (OPTIONS)
server.options('*', cors(corsOptions));

// Rotas
const UserRoutes = require('./Routes/UserRoutes');
server.use(UserRoutes);

const TaskRoutes = require("./Routes/TaskRoutes");
server.use(TaskRoutes);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
