const express = require("express");
const { productController } = require("../controllers");
const routers = express.Router();

routers.get("/get", productController.getProductData);
routers.post("/add-product", productController.addProductData);
routers.patch("/edit-product/:id", productController.editProductData);
routers.patch("/row", productController.editProductRow);
routers.delete("/delete-product/:idproduct", productController.deleteProductData);
module.exports = routers;
