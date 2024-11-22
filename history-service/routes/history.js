const { getHistories } = require("../controllers/history_controller");

const historyRoutes = [
  {
    method: "GET",
    path: "/histories",
    handler: getHistories,
  },
];

module.exports = historyRoutes;