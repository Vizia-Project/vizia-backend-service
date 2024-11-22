const Hapi = require("@hapi/hapi");

require("dotenv").config();
const PORT = process.env.PORT || 3003;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: { origin: ["*"] },
    },
  });

  server.route([
    {
      method: "GET",
      path: "/predicts",
      handler: (req, h) => "GET Predicts Requested!",
    },
  ]);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
