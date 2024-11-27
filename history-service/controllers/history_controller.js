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
        prediction_result: history.prediction,
        accuracy_in_percent: history.accuracy,
        photo_url: history.photo_url,
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
    const infoRef = firestore.collection("strain_infection_informations");
    const snapshot = await infoRef.doc(history[0].information_id).get();
    const infoDoc = snapshot.data();

    console.log("")

    // Mapping history schema for response
    const mappedHistory = history.map((history) => {
      return {
        id: history.id,
        prediction_result: history.prediction,
        accuracy_in_percent: history.accuracy,
        photo_url: history.photo_url,
        characteristics: infoDoc.characteristics,
        symptons: infoDoc.symptons,
        treatment: infoDoc.treatment,
        prevention: infoDoc.prevention,
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
    const { user_id, photo, prediction_result, accuracy_in_percent } =
      request.payload;
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

    // Query to check prediction_result type
    const infoRef = firestore.collection("strain_infection_informations");
    const snapshot = await infoRef
      .where("name", "==", "Bintitan") // TODO: Must from prediction_result later
      .get();
    const informationId = snapshot.docs[0].id;

    // Upload eye photo to cloud storage
    const gcsname = Date.now().toString();
    await bucket.file("eye-photos/saved/" + gcsname).save(photo, {
      metadata: {
        contentType: "image/jpeg",
      },
    });
    const newPhotoUrl = getPublicUrl(gcsname);

    // Query to save new analysis result
    await db.query(
      "INSERT INTO `saved_analysis_results` (`user_id`, `information_id`, `photo_url`, `prediction`, `accuracy`) VALUES (?, ?, ?, ?, ?)",
      [
        user_id,
        informationId,
        newPhotoUrl,
        prediction_result,
        accuracy_in_percent,
      ]
    );

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
