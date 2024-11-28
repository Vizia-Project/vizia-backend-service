const { getUser, updateUser } = require("../controllers/user_controller");

const userRoutes = [
  {
    method: "GET",
    path: "/user/{id}",
    handler: getUser,
  },
  {
    method: "PUT",
    path: "/user/{id}",
    options: {
      handler: updateUser,
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: "multipart/form-data"
      }
    },
  },
];

module.exports = userRoutes;
