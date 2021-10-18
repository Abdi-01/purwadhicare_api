const express = require("express");
const { orderController } = require("../controllers");
const routers = express.Router();

routers.post("/recipe/:id", orderController.uploadRecipe);
routers.patch("/payment/:id", orderController.uploadPayment);
routers.get("/orderData", orderController.getOrder);
module.exports = routers;
