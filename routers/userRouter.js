const router = require("express").Router();
const { userController } = require("../controllers");
const { body } = require("express-validator");
const { auth } = require("../helpers/authToken");
const { checkLogin, checkRegister } = require("../validator/user");
const { handleValidationError } = require("../middlewraes/handleError");

router.put(
  "/register",
  checkRegister(),
  handleValidationError,
  userController.userRegister
);
router.post(
  "/login",
  checkLogin(),
  handleValidationError,
  userController.login
);
router.patch("/verified", auth, userController.verification);
router.get("/profile/:id", userControllers.getUser);
router.patch("/picture/:id", userControllers.uploadPictureProfile);

module.exports = router;
