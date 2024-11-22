const { register, login } = require("../controllers/auth_controller");

const authRoutes = [
  {
    method: "POST",
    path: "/register",
    handler: register,
  },
  {
    method: "POST",
    path: "/login",
    handler: login,
  },
];

module.exports = authRoutes;
