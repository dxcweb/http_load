const master = require("./master");
const url = "https://api-search.720yun.com/search?channelId=0&content=%E5%A4%A7%E5%AD%A6&page=40&selected=2&type=1";
const timelimit = 60;
const maxSockets = 200;
const headers = {
  referer: "https://720yun.com/channel",
  origin: "https://720yun.com",
  "app-key": "eByjUyLDG2KtkdhuTsw2pY46Q3ceBPdT",
};
master(url, headers, timelimit, maxSockets, (result) => {
  console.log(result);
});
