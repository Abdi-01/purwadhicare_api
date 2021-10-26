const express = require("express");
const { ongkirControllers } = require("../controllers");
const routers = express.Router();

routers.get("/province", ongkirControllers.getProvince);
routers.get("/city/:id", ongkirControllers.getCity);
routers.post("/cost", ongkirControllers.getOngkir);
module.exports = routers;
