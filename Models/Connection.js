const { Pool } = require("pg");

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

connection.connect()
  .then(() => console.log("Conectado ao Postgres com sucesso!"))
  .catch(err => console.error("Erro de conexão", err));

module.exports = connection;
