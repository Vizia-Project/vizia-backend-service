async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const predictionData = await prediction.data();
    // const confidenceScore = Math.max(...score) * 100;

    // Process prediction data here...

    return { prediction_result: predictionData };
  } catch (error) {
    console.log(error);
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = predictClassification;
