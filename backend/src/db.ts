import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shopper',
  waitForConnections: true, 
  connectionLimit: 10, 
};

const pool = mysql.createPool(dbConfig);

export { pool };
