const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

require("dotenv").config();
const pathKey = path.resolve("./vizia-sa.json");

const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: pathKey,
  databaseId: "vizia-firestore",
});

module.exports = firestore;
