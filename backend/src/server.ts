import express from "express";
import cors from "cors"; 
import { router } from "./routes";
import mysql from 'mysql2';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3000, () => console.log("Server is running"));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shopper'
});

db.connect((err: Error | null) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida');
});

module.exports = db;
