const express = require("express");
const { orderController } = require("../controllers");
const routers = express.Router();
const { auth } = require("../helpers/authToken");

routers.post("/product", auth, orderController.addOrder);
routers.post("/recipe/:id", orderController.uploadRecipe);
routers.post("/payment/:id/:idorder", orderController.uploadPayment);
routers.get("/orderData", orderController.getOrder);
module.exports = routers;
