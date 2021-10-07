const { body } = require("express-validator");

// Validasi Register apakah sesuai syarat yang diminta
function checkRegister() {
  return [
    body("email").isEmail().withMessage("Email is incorrect"),
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must have at least 5 character")
      .isLowercase()
      .withMessage("Username only use lower case"),
    body("password")
      .isStrongPassword({
        minLength: 5,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must contain upper case, number, symbol, and with minimum 5 length"
      ),
  ];
}
// Proses Checking Login apakah sudah sesuai dari Persyaratan
function checkLogin() {
  return [
    body("email").isEmail().isLength({ min: 1 }).withMessage("Email is Empty"),
    body("password").isLength({ min: 1 }).withMessage("Password is Empty"),
  ];
}
function checkNewPassword() {
  return [
    body("password")
      .isStrongPassword({
        minLength: 5,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must contain upper case, number, symbol, and with minimum 5 length"
      ),
  ];
}

function checkForgetPassword() {
  return [
    body("email").isEmail().isLength({ min: 1 }).withMessage("Email is Empty"),
  ];
}

module.exports = {
  checkRegister,
  checkLogin,
  checkNewPassword,
  checkForgetPassword,
};
