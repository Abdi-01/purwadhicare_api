const express = require("express");
const { ongkirController } = require("../controllers");
const routers = express.Router();

routers.get("/province", ongkirController.getProvince);
routers.get("/city/:id", ongkirController.getCity);
routers.post("/cost", ongkirController.getOngkir);
module.exports = routers;
