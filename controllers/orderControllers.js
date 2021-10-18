const { db } = require("../database");
const { uploader } = require("../helpers/uploader");
const fs = require("fs");

module.exports = {
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
  addOrder: (req, res) => {
    try {
      const { full_name, phone_number, address, districts, postal_code, notes, province, city } = req.body.formShipping;
      let queryShipping = `INSERT INTO shipping (iduser, full_name, phone_number, address, province, city, districts, postal_code, notes)
       VALUES(${req.user.iduser}, '${full_name}', '${phone_number}', '${address}', '${province}','${city}', '${districts}', '${postal_code}', '${notes}');`;
      db.query(queryShipping, (err, results) => {
        if (err) {
          console.log(results);
          res.status(500).send(err);
        }
        let date_now = new Date().toISOString().slice(0, 10);
        let queryOrder = `INSERT INTO db_farmasi1.order (iduser, idshipping, order_price, order_date, total_item)
        VALUES(${req.user.iduser}, '${results.insertId}', '${req.body.total}', '${date_now}', ${req.body.cart.length});`;
        db.query(queryOrder, (err2, results2) => {
          if (err2) {
            console.log(err2);
            return res.status(500).send(err2);
          }
          const detailSql = "INSERT INTO order_detail (idorder, idproduct, total_netto, price, quantity) VALUES ? ";
          const detail = [
            req.body.cart.map((item) => [
              results2.insertId,
              item.idproduct,
              item.netto * item.quantity,
              item.price_stock * item.quantity,
              item.quantity,
            ]),
          ];
          db.query(detailSql, detail, (err3, results3) => {
            if (err3) {
              console.log(err3);
              return res.status(500).send(err3);
            }
            res.status(200).send({ message: "Add Order Success" });
          });
        });
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  handleOrder: (req, res) => {
    try {
      const idCart = [req.body.cart.map((item) => [item.idcart])];
      console.log(idCart);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  uploadRecipe: (req, res) => {
    try {
      let path = "/recipe";
      const upload = uploader(path, "IMG").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).send(error);
        }

        const { file } = req.files;
        const filepath = file ? path + "/" + file[0].filename : null;

        let data = JSON.parse(req.body.data);
        data.image = filepath;
        data.iduser = req.params.id;
        let { full_name, phone_number, address, districts, postal_code, notes, province, city, image, iduser } = data;
        console.log(data);

        let queryShipping = `INSERT INTO shipping (iduser, full_name, phone_number, address, province, city, districts, postal_code, notes)
          VALUES('${iduser}', '${full_name}', '${phone_number}', '${address}', '${province}','${city}', '${districts}', '${postal_code}', '${notes}');`;

        db.query(queryShipping, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filepath);
            return res.status(500).send(err);
          }
          let date_now = new Date().toISOString().slice(0, 10);
          let queryOrder = `INSERT INTO db_farmasi1.order (iduser, idshipping, order_date, recipe_image) VALUES('${iduser}', '${results.insertId}', '${date_now}', '${image}');`;
          db.query(queryOrder, (err2, results2) => {
            if (err2) {
              console.log(err2);
              return res.status(500).send(err2);
            }
            console.log(results2);
            res.status(200).send({ message: "Upload file success" });
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  uploadPayment: (req, res) => {
    try {
      let path = "/payment";
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

        let updateQuery = `UPDATE db_farmasi1.order SET payment_image = ${db.escape(filepath)} WHERE iduser = ${req.params.id};`;

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
};
