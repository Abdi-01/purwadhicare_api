const express = require("express");
const { profileController } = require("../controllers");
const routers = express.Router();

routers.get("/user-profile", profileController.getProfileData);
routers.post("/add-profile/:iduser", profileController.addProfileData);
routers.patch("/edit-profile/:id", profileController.editProfileData);
routers.delete("/delete-profile/:iduser", profileController.deleteProfileData);

module.exports = routers;
