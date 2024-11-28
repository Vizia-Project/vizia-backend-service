const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");

const jwtScheme = (server, options) => {
  return {
    authenticate: function (request, h) {
      const req = request.raw.req;
      const authorization = req.headers.authorization;

      if (!authorization) {
        throw Boom.unauthorized("missing");
      }

      try {
        jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
        return h.authenticated({ credentials: { user: "john" } });
      } catch (error) {
        console.log(authorization);
        throw Boom.unauthorized("invalid");
      }
    },
  };
};

const unauthorizedPreResponseCallback = (request, h) => {
  const response = request.response;

  if (Boom.isBoom(response)) {
    const statusCode = response.output.statusCode;
    const message = response.output.payload.message;

    if (statusCode === 401) {
      return h
        .response({
          status: "failed",
          message:
            message == "missing"
              ? "Unauthorized request. Please provide the bearer token."
              : "Invalid token.",
        })
        .code(401)
        .takeover();
    }
  }
  return h.continue;
};

const jwtPayload = {
  iss: "1037967286998-compute@developer.gserviceaccount.com",
  sub: "1037967286998-compute@developer.gserviceaccount.com",
  aud: "https://vizia-d8u2x8eu.an.gateway.dev",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 168h
};

module.exports = { jwtScheme, unauthorizedPreResponseCallback, jwtPayload };
