const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

const pathKey = path.resolve("./firestore-sa.json");

const db = new Firestore({
  databaseId: "vizia-firestore",
  keyFilename: pathKey,
});

const storeData = (id, data) => db.collection("predictions").doc(id).set(data);

module.exports = { db, storeData };
