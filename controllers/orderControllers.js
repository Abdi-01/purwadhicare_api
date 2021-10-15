const { db } = require("../database");
const { uploader } = require("../helpers/uploader");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/createToken");
const cryptojs = require("crypto-js");
const transporter = require("../helpers/nodemailer");
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  uploadRecipe: (req, res) => {
    console.log("teset", req.body);
    try {
      let path = "/recipe";
      const upload = uploader(path, "IMG").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).send(error);
        }

        const oldFile = "./public" + req.query.oldFile;
        if (fs.existsSync(oldFile)) {
          fs.unlink(oldFile, (err) => {
            console.log(err);
          });
        }

        const { file } = req.files;
        const filepath = file ? path + "/" + file[0].filename : null;

        let updateQuery = `UPDATE db_farmasi1.order SET recipe_image = ${db.escape(
          filepath
        )} WHERE iduser = ${req.params.id};`;

        db.query(updateQuery, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filepath);
            return res.status(500).send(err);
          }
          res.status(200).send({ message: "Upload file success" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getOrder: (req, res) => {
    let sql = `SELECT * FROM db_farmasi1.order WHERE iduser = ${req.query.iduser};`;
    db.query(sql, (err, results) => {
      if (err) {
        console.log(results);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
