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
      "SELECT idorder,  product_name, price_stock, order_detail.idproduct, price, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct";

    if (req.query.idorder) {
      detailTransactionQuery = ` SELECT idorder,  product_name, price_stock, order_detail.idproduct, price, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct where idorder = ${db.escape(
        req.query.idorder
      )} ;`;
    }

    db.query(detailTransactionQuery, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },

  allRevenue : (req, res) => {
    let scriptTotalRevenue = `Select SUM(order_price) as allrevenue from db_farmasi1.order WHERE order_status = 'Order Selesai';`;
    db.query(scriptTotalRevenue, (err, results) => {
      if(err) res.status(500).send(err)
      res.status(200).send(results)
    })
  },

  selectedRevenue : (req, res) => {
    // format '2021-11-15'
    // http://localhost:2200/transaction/selected-revenue?fromDate=2020-9-01&lastDate=2020-11-31 
      let scriptSelectedRevenue = `Select SUM(order_price) as selectedrevenue from db_farmasi1.order as selectedrevenue WHERE order_date BETWEEN ${db.escape(
        req.query.fromDate
      )} AND ${db.escape(req.query.lastDate)} AND order_status = 'Order Selesai';`;
    
    db.query(scriptSelectedRevenue, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
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
