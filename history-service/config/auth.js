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

module.exports = { jwtScheme, unauthorizedPreResponseCallback };
