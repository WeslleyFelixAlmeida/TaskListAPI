require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

const allowedOrigins = [,
  process.env.CLIENT_URL
];

server.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  credentials: true
}));

// Rotas
const UserRoutes = require('./Routes/UserRoutes');
server.use(UserRoutes);

const TaskRoutes = require("./Routes/TaskRoutes");
server.use(TaskRoutes);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
