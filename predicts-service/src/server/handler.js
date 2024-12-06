const { storeData } = require("../services/firestoreData");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");

async function postPredict(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { prediction_result } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = { id, prediction_result, createdAt };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });

  response.code(201);
  return response;
}

module.exports = { postPredict };
