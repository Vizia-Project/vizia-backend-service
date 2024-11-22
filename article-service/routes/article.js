const { getArticles } = require("../controllers/article_controller");

const articleRoutes = [
  {
    method: "GET",
    path: "/articles",
    handler: getArticles,
  },
];

module.exports = articleRoutes;