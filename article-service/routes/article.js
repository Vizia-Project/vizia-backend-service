const {
  getArticles,
  getArticleByUrl,
} = require("../controllers/article_controller");

const articleRoutes = [
  {
    method: "GET",
    path: "/articles",
    options: {
      auth: "jwt",
      handler: getArticles,
    },
  },
  {
    method: "GET",
    path: "/articles/detail",
    options: {
      auth: "jwt",
      handler: getArticleByUrl,
    },
  },
];

module.exports = articleRoutes;
