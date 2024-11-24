const validator = require("validator");

const userUpdateValidation = (name, email) => {
  const errors = {};

  if (!name || !validator.isLength(name, { min: 3 })) {
    errors.name = "Name must be at least 3 characters long.";
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = "Invalid email address.";
  }
  
  return errors;
};

module.exports = { userUpdateValidation };
