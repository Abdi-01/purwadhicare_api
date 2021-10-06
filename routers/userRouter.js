const router = require("express").Router();
const { userControllers } = require("../controllers");
const { body } = require("express-validator");
const { auth } = require("../helpers/authToken");
const { checkLogin, checkRegister } = require("../validator/user");
const { handleValidationError } = require("../middlewraes/handleError");

router.put(
  "/register",
  checkRegister(),
  handleValidationError,
  userControllers.userRegister
);
router.post(
  "/login",
  checkLogin(),
  handleValidationError,
  userControllers.login
);
router.patch("/verified", auth, userControllers.verification);
router.get("/profile/:id", userControllers.getUser);
router.patch("/picture/:id", userControllers.uploadPictureProfile);

module.exports = router;
