const { getUser } = require("../controllers/user_controller");

const userRoutes = [
  {
    method: "GET",
    path: "/user",
    options: {
      auth: "jwt",
      handler: getUser,
    },
  },
];

module.exports = userRoutes;
