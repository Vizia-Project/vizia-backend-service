const Hapi = require("@hapi/hapi");
const routes = require("./src/server/routes");
const loadModel = require("./src/services/loadModel");
const InputError = require("./src/exceptions/InputError");

require("dotenv").config();
const PORT = process.env.PORT || 3003;

(async () => {
  const server = Hapi.server({
    port: PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: { cors: { origin: ["*"] } },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response.isBoom && response.output.statusCode === 413) {
      const newResponse = h.response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });

      newResponse.code(413);
      return newResponse;
    }

    if (response instanceof InputError || response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });

      newResponse.code(400);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
})();
