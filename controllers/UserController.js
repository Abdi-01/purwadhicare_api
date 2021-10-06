const { db } = require("../database");
const { uploader } = require("../helper/uploader");
const fs = require("fs");

module.exports = {
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

        let updateQuery = `UPDATE user SET picture = ${db.escape(filepath)} WHERE iduser = ${req.params.id};`;

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
};
