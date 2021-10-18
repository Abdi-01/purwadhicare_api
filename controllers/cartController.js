const { db } = require("../database");

module.exports = {
  getCartData: (req, res) => {
    let cartScriptQuery = `Select product_name, price_stock, image, stock, netto, total_netto, category, idcart, iduser, product.idproduct, quantity from cart inner join product on cart.idproduct = product.idproduct WHERE iduser = ${db.escape(
      req.query.iduser
    )};`;

    if (req.query.iduser && req.query.idproduct) {
      cartScriptQuery = `Select product_name, price_stock, image, stock, netto, total_netto, category, idcart, iduser, product.idproduct, quantity from cart inner join product on cart.idproduct=product.idproduct WHERE iduser = ${db.escape(
        req.query.iduser
      )} and cart.idproduct = ${db.escape(req.query.idproduct)};`;
      // contoh : http://localhost:2200/cart?iduser=49
    }

    db.query(cartScriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  addCartData: (req, res) => {
    let { iduser, idproduct, quantity } = req.body;
    let addCartQuery = `Insert into cart values (null, ${db.escape(iduser)}, ${db.escape(idproduct)},${db.escape(quantity)});`;

    db.query(addCartQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      res.status(200).send(results);
    });
  },

  editCartData: (req, res) => {
    // kita akan rubah array mjd string
    let cartUpdate = [];
    for (let prop in req.body) {
      // looping utk generate string data yang akan disimpan
      cartUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
    }

    let updateCartQuery = `Update cart set ${cartUpdate} where idcart = ${req.params.idcart};`;

    db.query(updateCartQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },

  deleteCartData: (req, res) => {
    let deleteCartQuery = `Delete from cart where idcart = ${db.escape(req.params.idcart)};`;

    db.query(deleteCartQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};
