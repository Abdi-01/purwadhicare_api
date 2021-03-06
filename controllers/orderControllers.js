const { db } = require("../database");
const { uploader } = require("../helpers/uploader");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/createToken");
const cryptojs = require("crypto-js");
const transporter = require("../helpers/nodemailer");
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  getOrder: (req, res) => {
    let verify = jwt.verify(req.headers.token, TOKEN_KEY);
    let id = parseInt(verify.iduser);
    let sql = `SELECT * FROM db_farmasi1.order WHERE iduser = ${id};`;
    db.query(sql, (err, results) => {
      if (err) {
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
  getDetailOrderRecipe: (req, res) => {
    let getRecipeQuery = `SELECT idorder, user.full_name as user_full_name, shipping.*, province.province, city_name, type, order_status, order_date, recipe_image
      FROM db_farmasi1.order JOIN user ON db_farmasi1.order.iduser = user.iduser
      JOIN shipping ON db_farmasi1.order.idshipping = shipping.idshipping
      JOIN province ON shipping.province = province.idprovince
      JOIN city ON shipping.city = city.idcity
      WHERE idorder = ${req.params.idorder};`;

    db.query(getRecipeQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
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
          let queryOrder = `INSERT INTO db_farmasi1.order (iduser, idshipping, order_status, order_date, recipe_image) VALUES('${iduser}', '${results.insertId}', "Validasi Resep", '${date_now}', '${image}');`;
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

        let updateQuery = `UPDATE db_farmasi1.order SET order_status = "Menunggu Pengiriman", payment_image = ${db.escape(
          filepath
        )} WHERE iduser = ${req.params.id} AND idorder = ${req.params.idorder};`;

        db.query(updateQuery, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filepath);
            return res.status(500).send(err);
          }
          res.status(200).send({ message: "Upload file success!" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getOrderRecipe: (req, res) => {
    let getRecipeQuery = `SELECT idorder,db_farmasi1.order.iduser, user.full_name,user.email,age, order_status, order_date
    FROM db_farmasi1.order JOIN user ON db_farmasi1.order.iduser = user.iduser WHERE order_status = "Validasi Resep";`;

    db.query(getRecipeQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getOrderRecipeSuccess: (req, res) => {
    let getRecipeQuery = `CALL RecipeOrderLIst();`;

    db.query(getRecipeQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getSalesReport: (req, res) => {
    let getRecipeQuery = `CALL OrderList();`;

    db.query(getRecipeQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  addOrderRecipe: (req, res) => {
    const { idorder, order_price } = req.body.order;

    const orderSql = `UPDATE db_farmasi1.order SET order_price = ${order_price} , order_status = "Menunggu Pembayaran" WHERE idorder = ${idorder}; `;
    console.log(orderSql);
    db.query(orderSql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      const detailSql = "INSERT INTO order_detail (idorder, idproduct, total_netto, price, quantity) VALUES ? ";
      const detail = [req.body.detail_order.map((item) => [item.idorder, item.idproduct, item.total_netto, item.price, 0])];
      db.query(detailSql, detail, (err2, result) => {
        if (err2) return res.status(500).send(err2);
        let updateQuery = "";
        req.body.detail_order.forEach((val) => {
          let netto = val.prev_total_netto - val.total_netto;
          updateQuery += `UPDATE product SET total_netto = ${netto} WHERE idproduct = ${val.idproduct}; `;
        });
        db.query(updateQuery, (err, results) => {
          if (err) res.status(500).send(err);
          res.status(200).send({ message: "Add Order Success" });
        });
      });
    });
  },
};
