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
      "SELECT idorder,  product_name, price_stock, order_detail.idproduct, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct";

    if (req.query.idorder) {
      detailTransactionQuery = ` SELECT idorder,  product_name, price_stock, order_detail.idproduct, quantity from order_detail INNER JOIN product on order_detail.idproduct = product.idproduct where idorder = ${db.escape(
        req.query.idorder
      )} ;`;
    }

    db.query(detailTransactionQuery, (err, result) => {
      if (err) res.status(500).send(err);
      res.status(200).send(result);
    });
  },

  allRevenue: (req, res) => {
    let scriptTotalRevenue = `Select SUM(order_price) as allrevenue from db_farmasi1.order WHERE order_status = 'Order Selesai';`;
    db.query(scriptTotalRevenue, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  selectedRevenue: (req, res) => {
    // format '2021-11-15'
    // http://localhost:2200/transaction/selected-revenue?fromDate=2020-9-01&lastDate=2020-11-31
    let scriptSelectedRevenue = `Select SUM(order_price) as selectedrevenue from db_farmasi1.order as selectedrevenue WHERE order_date BETWEEN ${db.escape(
      req.query.fromDate
    )} AND ${db.escape(
      req.query.lastDate
    )} AND order_status = 'Order Selesai';`;

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

  confirmTransaction: (req, res) => {
    let confirmQuery = `UPDATE db_farmasi1.order set order_status = 'Order Selesai' where idorder = ${req.params.idorder};`;
    console.log(confirmQuery);

    db.query(confirmQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  rejectTransaction: (req, res) => {
    // ubah status transaksi
    let rejectQuery = `UPDATE db_farmasi1.order set order_status = 'Transaksi Dibatalkan' where idorder = ${req.params.idorder};`;
    console.log(rejectQuery);

    db.query(rejectQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  cancelQuantity: (req, res) => {
    let updateQuery = "";
    req.body.detailTrans.forEach((val) => {
      let netto = val.prev_netto + val.total_netto;

      updateQuery += `UPDATE product SET total_netto = ${netto}  WHERE idproduct = ${val.idproduct}; `;
    });
    console.log(req.body.detailTrans);
    console.log(updateQuery);

    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  getDetailTransaction: (req, res) => {
    let DetailTransaction = `Select p.total_netto as prev_netto , p.idproduct, u.full_name, od.idorder, od.total_netto, od.price, od.quantity, s.idshipping, s.address, order_price, order_status, order_date, total_item, payment_image , product_name 
    FROM db_farmasi1.order_detail as od 
    JOIN db_farmasi1.order  o ON od.idorder = o.idorder 
    JOIN product p ON od.idproduct = p.idproduct 
    JOIN shipping as s on s.idshipping = o.idshipping 
    JOIN user as u on u.iduser = o.iduser
    where od.idorder = ${req.params.id};`;

    db.query(DetailTransaction, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};
