const Hapi = require("@hapi/hapi");
const articleRoutes = require("./routes/article");
// const { jwtScheme, unauthorizedPreResponseCallback } = require("./config/auth");

require("dotenv").config();
const PORT = process.env.PORT || 3001;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: { cors: { origin: ["*"] } },
  });

  // server.auth.scheme("jwtScheme", jwtScheme);
  // server.auth.strategy("jwt", "jwtScheme");

  server.route([...articleRoutes]);

  // server.ext("onPreResponse", unauthorizedPreResponseCallback);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
