const validator = require("validator");

const getHistoriesValidation = (user_id) => {
  const errors = {};

  if (!user_id || !validator.isInt(user_id.toString())) {
    errors.user_id = "User ID is required and must be a number.";
  }

  return errors;
};

const addHistoryValidation = ({
  user_id,
  photo,
  prediction_result,
  accuracy_in_percent,
}) => {
  const errors = {};

  if (!user_id || !validator.isInt(user_id.toString())) {
    errors.user_id = "User ID is required and must be a number.";
  }

  if (!photo) {
    errors.photo = "Photo is required and must be a valid file.";
  }

  if (
    !prediction_result ||
    !validator.isLength(prediction_result, { min: 3 })
  ) {
    errors.prediction_result =
      "Prediction result is required and must be a non-empty string.";
  }

  if (
    accuracy_in_percent === undefined ||
    !validator.isDecimal(accuracy_in_percent.toString())
  ) {
    errors.accuracy_in_percent =
      "Accuracy in percent is required and must be a decimal number.";
  }

  return errors;
};

module.exports = { getHistoriesValidation, addHistoryValidation };
