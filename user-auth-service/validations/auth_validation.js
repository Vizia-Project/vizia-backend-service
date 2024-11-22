const validator = require("validator");

const registerValidation = (name, email, password, password_confirmation) => {
  const errors = {};

  if (!name || !validator.isLength(name, { min: 3 })) {
    errors.name = "Name must be at least 3 characters long.";
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = "Invalid email address.";
  }

  if (!password || !validator.isLength(password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (
    !password_confirmation ||
    !validator.isLength(password_confirmation, { min: 6 })
  ) {
    errors.password_confirmation =
      "Password confirmation must be at least 6 characters long.";
  }

  if (password && password_confirmation && password != password_confirmation) {
    errors.password_confirmation =
      "Password confirmation does not match the password.";
  }

  return errors;
};

const loginValidation = (email, password) => {
  const errors = {};

  if (!email || !validator.isEmail(email)) {
    errors.email = "Invalid email address.";
  }

  if (!password || !validator.isLength(password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters long.";
  }

  return errors;
};

module.exports = { registerValidation, loginValidation };
