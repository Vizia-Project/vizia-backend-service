const { Storage } = require("@google-cloud/storage");
const path = require("path");

require("dotenv").config();

const pathKey = path.resolve("./vizia-sa.json");

const gcs = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFile: pathKey,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = gcs.bucket(bucketName);

const getPublicUrl = (filename) => {
  return "https://storage.googleapis.com/" + bucketName + "/user-photos/" + filename;
};

module.exports = { bucket, bucketName, getPublicUrl };
