const { db } = require("../database");
const { uploader } = require("../helpers/uploader");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/createToken");
const cryptojs = require("crypto-js");
const transporter = require("../helpers/nodemailer");
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  // Controller untuk Proses Register
  userRegister: (req, res) => {
    console.log(req.body);
    let { username, email, password } = req.body;
    const hashpass = cryptojs.HmacMD5(password, TOKEN_KEY).toString();
    let insertQuery = `Insert INTO user (username, email, password) values ('${username}','${email}','${hashpass}');`;
    // console.log(insertQuery);
    // console.log(password);
    db.query(insertQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      console.log(results.insertId);
      if (results.insertId) {
        let sqlGet = `Select * from user where iduser = ${results.insertId};`;
        db.query(sqlGet, (err2, results2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2);
          }
          // Bahan data untuk membuat token
          let { iduser, username, email } = results2[0];
          // Membuat token
          let token = createToken({ iduser, username, email });
          // Isi Email yang akan dikirimkan
          let mail = {
            from: `Admin <purwadhicare@gmail.com>`,
            to: `${email}`,
            subject: "Purwadhicare User Account Verification",
            html: `<img src="https://i.ibb.co/8dp71H3/logo.png" />
            <hr />
            <h3>Hello, ${username}</h3>
            <h3>Thank you for registering your account with Purwadhicare! 😃</h3>
            <h5>
              To finish setting up your account and buy our products, click the link below for your account verification.
            </h5>
            <h5>
              <a href="http://localhost:3000/authentication/${token}"
                >Verify Your Account Here</a
              >
            </h5>
            <br>
            <br>
            <p>Regards, Admin Purwadhicare</p>`,
          };

          transporter.sendMail(mail, (errMail, resMail) => {
            if (errMail) {
              console.log(errMail);
              res.status(500).send({
                message: "Registration Failed!",
                success: false,
                err: errMail,
              });
            }
            res.status(200).send({
              message: "Registration Success, Check Your Email!",
              success: true,
            });
          });
        });
      }
    });
  },
  // Controller untuk Proses Verifikasi
  verification: (req, res) => {
    console.log(req.user);
    let updateQuery = `Update user set is_active='true' where iduser = ${req.user.iduser};`;

    db.query(updateQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send({ message: "Verified Account", success: true });
    });
  },
  // Controller untuk Proses Login
  login: (req, res) => {
    let { email, password } = req.body;
    const hashpass = cryptojs.HmacMD5(password, TOKEN_KEY).toString();
    let scriptQuery = `Select * from user where email='${email}' and password='${hashpass}';`;
    // console.log(req.body, scriptQuery);
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      if (results[0]) {
        let { iduser, username, email, password, is_active } = results[0];
        let token = createToken({
          iduser,
          username,
          email,
          password,
          is_active,
        });
        if (is_active != "true") {
          res.status(200).send({ message: "Your account is not verified" });
        } else {
          res
            .status(200)
            .send({ dataLogin: results[0], token, message: "Login Success" });
        }
      }
    });
  },
  getUser: (req, res) => {
    let sql = `SELECT full_name, username, email, gender, address, age, picture FROM user WHERE iduser = ${req.params.id};`;
    console.log(sql);
    db.query(sql, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  uploadPictureProfile: (req, res) => {
    try {
      let path = "/images";
      const upload = uploader(path, "IMG").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }

        const { file } = req.files;
        const filepath = file ? path + "/" + file[0].filename : null;

        let updateQuery = `UPDATE user SET picture = ${db.escape(
          filepath
        )} WHERE iduser = ${req.params.id};`;

        db.query(updateQuery, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filepath);
            res.status(500).send(err);
          }
          res.status(200).send({ message: "Upload file success" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  forgetPassword: (req, res) => {
    let { email } = req.body;
    const checkUser = `SELECT * FROM user WHERE email='${email}'`;
    db.query(checkUser, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      // Bahan data untuk membuat token
      let { iduser, email } = results[0];
      // Membuat token
      let token = createToken({ iduser, email });
      let mail = {
        from: `Admin <purwadhicare@gmail.com>`,
        to: `${email}`,
        subject: "Reset Password Purwadhicare User Account",
        html: `<img src="https://i.ibb.co/8dp71H3/logo.png" />
        <hr />
        <h3>Hello, Purwadhicare User</h3>
        <h3>Seems like you forgot your own account password 😅</h3>
        <sp>
          To reset your password, please click the link below.
        </sp>
        <h5>
          <a href="http://localhost:3000/reset-password/${token}"
            >Reset Your Password Here</a
          >
        </h5>
        <br>
        <br>
        <p>Regards, Admin Purwadhicare</p>`,
      };
      transporter.sendMail(mail, (errMail, resMail) => {
        if (errMail) {
          console.log(errMail);
          res.status(500).send({
            message: "Reset Password Failed!",
            success: false,
            err: errMail,
          });
        }
        res.status(200).send({
          message: "To Reset Your Password, Check Your Email!",
          success: true,
        });
      });
    });
  },
  resetPassword: (req, res) => {
    console.log(req.body);
    const { token, password } = req.body;
    let verify = jwt.verify(token, TOKEN_KEY);
    console.log(verify);
    const hashpass = cryptojs.HmacMD5(password, TOKEN_KEY).toString();
    const verifyAccount = `update user set password = '${hashpass}' where email = '${verify.email}'`;
    db.query(verifyAccount, (err, results) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({ message: "Password Has Change." });
    });
  },
};
