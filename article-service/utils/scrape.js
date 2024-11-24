const getImg = ($) => {
  let a = $("#postContent > *:not(div)").length;
  if (a.length > 0) {
    return "#postContent img".attr("src");
  } else {
    return $(".post-content img").attr("src");
  }
};

// const getContent = ($) => {
//   let contentType1 = "#postContent > *:not(div)";
//   let contentType2 = ".post-content > *:not(div)";
//   return contentLoad($, contentType1) != ""
//     ? contentLoad($, contentType1)
//     : contentLoad($, contentType2);
// };

// const contentLoad = ($, parameter) => {
//   return Array.from($(parameter))
//     .map((elm) => $(elm).text().replace(/\n/g, " "))
//     .filter((e) => e !== "");
// };

module.exports = { getImg };
