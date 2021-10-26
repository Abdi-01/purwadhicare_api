const express = require("express");
const { orderController } = require("../controllers");
const routers = express.Router();
const { auth } = require("../helpers/authToken");

routers.post("/product", auth, orderController.addOrder);
routers.post("/recipe-product", orderController.addOrderRecipe);
routers.post("/recipe/:id", orderController.uploadRecipe);
routers.post("/payment/:id/:idorder", orderController.uploadPayment);
routers.get("/orderData", orderController.getOrder);
routers.get("/recipe-admin", orderController.getOrderRecipe);
routers.get("/recipe-success-admin", orderController.getOrderRecipeSuccess);
routers.get("/sales-report", orderController.getSalesReport);
routers.get("/detail-recipe-admin/:idorder", orderController.getDetailOrderRecipe);
module.exports = routers;
