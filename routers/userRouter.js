const express = require("express");
const { userControllers } = require("../controllers");
const routers = express.Router();

routers.get("/profile/:id", userControllers.getUser);
routers.patch("/picture/:id", userControllers.uploadPictureProfile);

module.exports = routers;
