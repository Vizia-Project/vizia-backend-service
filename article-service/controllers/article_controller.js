const axios = require("axios");
const cheerio = require("cheerio");
const { getImg } = require("../utils/scrape");

const ROOT_URL = "https://www.alodokter.com";

const getArticles = async (request, h) => {
  try {
    const { page = 1 } = request.query;
    const url = `${ROOT_URL}/search?s=infeksi+mata&page=${page}`;

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const dataRaw = $("card-post-index");
    const content = [];

    for (const elm of dataRaw) {
      let objectData = {
        title: elm.attribs["title"],
        image: elm.attribs["image-url"],
        description: elm.attribs["short-description"],
        source_url: ROOT_URL + elm.attribs["url-path"],
      };
      content.push(objectData);
    }

    return h
      .response({
        status: "success",
        message: "Success get all articles data",
        data: content,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

const getArticleByUrl = async (request, h) => {
  try {
    const { url } = request.query;

    if (!url) {
      return h
        .response({
          status: "failed",
          message: "Please provide source url in query parameter",
        })
        .code(400);
    }

    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const data = {
      title: $(
        "body > div.content > div > div > div.main-container > div.title-tag-container > h1"
      ).text(),
      image: getImg($),
      content: $.html("#postContent").replace(/\n/g, " "),
    };

    return h
      .response({
        status: "success",
        message: "Success get article by url",
        data,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

module.exports = { getArticles, getArticleByUrl };
