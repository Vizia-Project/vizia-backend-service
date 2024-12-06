const firestore = require("../utils/firestore");
const db = require("../config/database");
const { bucket, getPublicUrl } = require("../utils/img_upload");
const {
  addHistoryValidation,
  getHistoriesValidation,
} = require("../validators/history_validation");

const getHistories = async (request, h) => {
  try {
    // Validate & destructuring request payload
    const { user_id } = request.query;
    const validate = getHistoriesValidation(user_id);

    // Check validation errors possibility
    if (Object.keys(validate).length !== 0) {
      return h
        .response({
          status: "failed",
          message: "Parameter doesn't meet validation",
          validation: validate,
        })
        .code(400);
    }

    // Get histories by user_id from database
    const [histories] = await db.query(
      "SELECT * FROM `saved_analysis_results` WHERE `user_id`=?",
      [user_id]
    );

    // Mapping histories schema for response
    const mappedHistories = histories.map((history) => {
      return {
        id: history.id,
        prediction_result: history.prediction_result,
        accuracy: history.accuracy,
        image: history.image,
      };
    });

    return h
      .response({
        status: "success",
        message: "Success get analysis histories",
        data: mappedHistories,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

const getHistoryById = async (request, h) => {
  try {
    // Destructuring request payload
    const { id } = request.params;

    // Check if history not found
    const [history] = await db.query(
      "SELECT * FROM `saved_analysis_results` WHERE `id`=?",
      [id]
    );
    if (history.length === 0) {
      return h
        .response({
          status: "failed",
          message: "History is not found",
        })
        .code(404);
    }

    // Query to check prediction information
    const [result_answers] = await db.query(
      "SELECT * FROM `health_quiz_answers` WHERE `result_analysis_id`=?",
      [id]
    );
    const resultAnswers = result_answers.map((result) => result.answer);

    // Mapping history schema for response
    const mappedHistory = history.map((history) => {
      return {
        id: history.id,
        date: history.date,
        image: history.image,
        question_result: resultAnswers,
        infection_status: history.infection_status,
        prediction_result: history.prediction_result,
        accuracy: history.accuracy,
        information: history.information,
      };
    });

    return h
      .response({
        status: "success",
        message: "Success get analysis history by id",
        data: mappedHistory[0],
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

const addHistory = async (request, h) => {
  try {
    // Validate & destructuring request payload
    const {
      user_id,
      date,
      image,
      question_result,
      infection_status,
      prediction_result,
      accuracy,
      information,
    } = request.payload;
    const validate = addHistoryValidation(request.payload);

    // Check validation errors possibility
    if (Object.keys(validate).length !== 0) {
      return h
        .response({
          status: "failed",
          message: "History input doesn't meet validation",
          validation: validate,
        })
        .code(400);
    }

    // Upload eye photo to cloud storage
    const gcsname = Date.now().toString();
    await bucket.file("eye-photos/saved/" + gcsname).save(image, {
      metadata: {
        contentType: "image/jpeg",
      },
    });
    const newPhotoUrl = getPublicUrl(gcsname);

    // Query to save new analysis result
    const [savedAnalysis] = await db.query(
      "INSERT INTO `saved_analysis_results` (`user_id`, `date`, `image`, `infection_status`, `prediction_result`, `accuracy`, `information`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        date,
        newPhotoUrl,
        infection_status,
        prediction_result,
        accuracy,
        information,
      ]
    );

    // Iterate insert answers as DB transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    for (const result of question_result) {
      await connection.query(
        "INSERT INTO `health_quiz_answers` (`result_analysis_id`, `answer`) VALUES (?, ?)",
        [savedAnalysis.insertId, result]
      );
    }
    await connection.commit();
    connection.release();

    return h
      .response({
        status: "success",
        message: "New history creation is success",
      })
      .code(201);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

module.exports = { getHistories, getHistoryById, addHistory };
