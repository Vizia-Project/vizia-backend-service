const {
  getHistories,
  addHistory,
  getHistoryById,
} = require("../controllers/history_controller");

const historyRoutes = [
  {
    method: "GET",
    path: "/histories",
    options: {
      auth: "jwt",
      handler: getHistories,
    },
  },
  {
    method: "GET",
    path: "/histories/{id}",
    options: {
      auth: "jwt",
      handler: getHistoryById,
    },
  },
  {
    method: "POST",
    path: "/histories",
    options: {
      auth: "jwt",
      handler: addHistory,
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: "multipart/form-data"
      }
    },
  },
];

module.exports = historyRoutes;
