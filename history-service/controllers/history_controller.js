const dbFirestore = require("../config/firestore");
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
    const savedAnalysisResultsRef = dbFirestore.collection(
      "saved_analysis_results"
    );
    const resDocs = await savedAnalysisResultsRef
      .where("user_id", "==", user_id)
      .get();

    // Mapping histories schema for response
    const histories = [];
    resDocs.docs.forEach((doc) =>
      histories.push({
        id: doc.data()["id"],
        prediction_result: doc.data()["prediction_result"],
        accuracy: doc.data()["accuracy"],
        image: doc.data()["image"],
      })
    );

    return h
      .response({
        status: "success",
        message: "Success get analysis histories",
        data: histories,
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
    const analysisRes = await dbFirestore
      .collection("saved_analysis_results")
      .where("id", "==", id)
      .get();
    if (analysisRes.docs.length === 0) {
      return h
        .response({
          status: "failed",
          message: "History is not found",
        })
        .code(404);
    }

    // Query to check prediction information
    const anwersRes = await dbFirestore
      .collection("health_quiz_answers")
      .where("result_analysis_id", "==", id)
      .get();
    const resultAnswers = anwersRes.docs.map((result) => result.data()['answer']);

    // Mapping history schema for response
    const history = {
      id: analysisRes.docs[0].data()['id'],
      date: analysisRes.docs[0].data()['date'],
      image: analysisRes.docs[0].data()['image'],
      question_result: resultAnswers,
      infection_status: analysisRes.docs[0].data()['infection_status'],
      prediction_result: analysisRes.docs[0].data()['prediction_result'],
      accuracy: analysisRes.docs[0].data()['prediction_result'],
      information: analysisRes.docs[0].data()['information'],
    };

    return h
      .response({
        status: "success",
        message: "Success get analysis history by id",
        data: history,
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
    const id = crypto.randomUUID();
    await dbFirestore.collection("saved_analysis_results").doc().set({
      id,
      user_id,
      date,
      infection_status,
      prediction_result,
      accuracy,
      information,
      image: newPhotoUrl,
    });

    // Iterate insert answers as DB transaction
    const batch = dbFirestore.batch();
    const healthQuizAnswerDocs = [];

    for (const result of question_result) {
      healthQuizAnswerDocs.push({
        answer: result,
        result_analysis_id: id,
      });
    }

    const quizAnswersRef = dbFirestore.collection("health_quiz_answers");
    healthQuizAnswerDocs.forEach((data) => {
      const docRef = quizAnswersRef.doc();
      batch.set(docRef, data);
    });
    await batch.commit();

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
