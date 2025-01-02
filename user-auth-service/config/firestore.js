const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

const pathKey = path.resolve("./vizia-sa.json");

const dbFirestore = new Firestore({
  databaseId: process.env.FIRESTORE_DB_ID,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: pathKey,
});

module.exports = dbFirestore;
