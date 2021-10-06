const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

db.getConnection((err, connection) => {
  if (err) {
    return console.log("error mysql", err.message);
  }
  console.log(`Connected to mysql server`, connection.threadId);
});

module.exports = { db };
