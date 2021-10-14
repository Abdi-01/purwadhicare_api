const express = require("express");
const { cartController } = require("../controllers");
const routers = express.Router();

routers.get("/get", cartController.getCartData);
routers.post("/add-cart", cartController.addCartData);
routers.patch("/edit-cart/:idcart", cartController.editCartData);
routers.delete("/delete-cart/:idcart", cartController.deleteCartData);

module.exports = routers