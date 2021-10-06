const mysql = require("mysql");

// Membuat Koneksi dengan Database db_farmasi1
const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = db;
