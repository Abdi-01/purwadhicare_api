const nodemailer = require("nodemailer");
const password = process.env.NODEMAILER_PASS;
const email = process.env.NODEMAILER_USER;
// Transporter untuk Proses Verifikasi Email melalui Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
