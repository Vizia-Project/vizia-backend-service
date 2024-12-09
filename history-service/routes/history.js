const {
  getHistories,
  addHistory,
  getHistoryById,
} = require("../controllers/history_controller");

const historyRoutes = [
  {
    method: "GET",
    path: "/histories",
    handler: getHistories,
  },
  {
    method: "GET",
    path: "/histories/{id}",
    handler: getHistoryById,
  },
  {
    method: "POST",
    path: "/histories",
    options: {
      handler: addHistory,
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
        maxBytes: 10000000,
      }
    },
  },
];

module.exports = historyRoutes;
