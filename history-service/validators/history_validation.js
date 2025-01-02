const validator = require("validator");

const getHistoriesValidation = (user_id) => {
  const errors = {};

  if (!user_id) {
    errors.user_id = "User ID is required.";
  }

  return errors;
};

const addHistoryValidation = ({
  user_id,
  date,
  image,
  question_result,
  infection_status,
  prediction_result,
  accuracy,
  information,
}) => {
  const errors = {};

  if (!user_id) {
    errors.user_id = "User ID is required.";
  }

  if (!date) {
    errors.date = "Invalid or missing date.";
  }

  if (!image) {
    errors.image = "Photo is required and must be a valid file.";
  }

  if (!Array.isArray(question_result)) {
    errors.question_result = "Question result must be an array of number.";
  }

  if (!infection_status) {
    errors.infection_status = "Infection status is required.";
  }

  if (!prediction_result) {
    errors.prediction_result = "Prediction result is required.";
  }

  if (!accuracy || !validator.isDecimal(accuracy.toString())) {
    errors.accuracy = "Accuracy is required and must be a decimal number.";
  }

  if (!information) {
    errors.information = "Information is required.";
  }

  return errors;
};

module.exports = { getHistoriesValidation, addHistoryValidation };
