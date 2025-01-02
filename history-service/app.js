const Hapi = require("@hapi/hapi");
const historyRoutes = require("./routes/history");
// const { jwtScheme, unauthorizedPreResponseCallback } = require("./config/auth");

require("dotenv").config();
const PORT = process.env.PORT || 3004;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: { cors: { origin: ["*"] } },
  });

  // server.auth.scheme("jwtScheme", jwtScheme);
  // server.auth.strategy("jwt", "jwtScheme");

  server.route([...historyRoutes]);

  // server.ext("onPreResponse", unauthorizedPreResponseCallback);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
