const express = require("express");
const { orderController } = require("../controllers");
const routers = express.Router();

routers.post("/order/recipe/:id", orderController.uploadRecipe);
routers.get("/order", orderController.getOrder);
module.exports = routers;
