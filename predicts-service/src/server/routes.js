const { postPredict } = require("./handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredict,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },
];

module.exports = routes;
