const Hapi = require("@hapi/hapi");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const { jwtScheme, unauthorizedPreResponseCallback } = require("./config/auth");

require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3002,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: { cors: { origin: ["*"] } },
  });

  // server.auth.scheme("jwtScheme", jwtScheme);
  // server.auth.strategy("jwt", "jwtScheme");

  server.route([...userRoutes, ...authRoutes]);

  // server.ext("onPreResponse", unauthorizedPreResponseCallback);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
