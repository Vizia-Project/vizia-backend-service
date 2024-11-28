const {
  getArticles,
  getArticleByUrl,
} = require("../controllers/article_controller");

const articleRoutes = [
  {
    method: "GET",
    path: "/articles",
    handler: getArticles,
  },
  {
    method: "GET",
    path: "/articles/detail",
    handler: getArticleByUrl,
  },
];

module.exports = articleRoutes;
