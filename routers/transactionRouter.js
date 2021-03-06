const express = require("express");
const { transactionController } = require("../controllers");
const routers = express.Router();

routers.get("/get-history", transactionController.getTransactionHistory);
routers.get("/get-detail", transactionController.detailTransactionHistory);
routers.get("/get-transaction", transactionController.getAllTransaction);
routers.get("/all-revenue", transactionController.allRevenue);
routers.get("/selected-revenue", transactionController.selectedRevenue);
routers.patch(
  "/confirm-transaction/:idorder",
  transactionController.confirmTransaction
);
routers.patch(
  "/reject-transaction/:idorder",
  transactionController.rejectTransaction
);
routers.patch("/cancel-quantity", transactionController.cancelQuantity);
routers.get(
  "/detail-transaction/:id",
  transactionController.getDetailTransaction
);
module.exports = routers;
