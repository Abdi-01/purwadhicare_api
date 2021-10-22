const { db } = require("../database");

module.exports = {
  getTransactionHistory: (req, res) => {
    let scriptQueryHistory = "SELECT * from db_farmasi1.order;";

    if (req.query.iduser) {
      scriptQueryHistory = `SELECT * from db_farmasi1.order where iduser = ${db.escape(
        req.query.iduser
      )} ;`;
    }
    db.query(scriptQueryHistory, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },

  detailTransactionHistory: (req, res) => {
    let detailTransactionQuery =
      "SELECT idorder,  product_name, order_detail.idproduct, price, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct";

    if (req.query.idorder) {
      detailTransactionQuery = ` SELECT idorder,  product_name, order_detail.idproduct, price, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct where idorder = ${db.escape(
        req.query.idorder
      )} ;`;
    }

    db.query(detailTransactionQuery, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },
  getAllTransaction: (req, res) => {
    let AllTransactionsQuery = `SELECT idorder, user.full_name, db_farmasi1.order.order_status, db_farmasi1.order.order_date, 
    db_farmasi1.order.total_item, db_farmasi1.order.order_price, shipping.address
    FROM db_farmasi1.order JOIN user ON db_farmasi1.order.iduser = user.iduser 
    JOIN shipping ON db_farmasi1.order.idshipping= shipping.idshipping;`;

    db.query(AllTransactionsQuery, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};
