const { validationResult } = require("express-validator");

// Handle Untuk Error saat validasi
function handleValidationError(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
}

module.exports = { handleValidationError };
