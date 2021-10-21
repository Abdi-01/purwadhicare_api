const express = require("express");
const { orderController } = require("../controllers");
const routers = express.Router();
const { auth } = require("../helpers/authToken");

routers.post("/product", auth, orderController.addOrder);
routers.post("/recipe/:id", orderController.uploadRecipe);
routers.patch("/payment/:id", orderController.uploadPayment);
routers.get("/orderData", orderController.getOrder);
routers.get("/recipe-admin", orderController.getOrderRecipe);
routers.get("/detail-recipe-admin/:idorder", orderController.getDetailOrderRecipe);
module.exports = routers;
