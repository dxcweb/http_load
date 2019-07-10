const http = require("http");
const https = require("https");
const { parse } = require("url");

function worker(url, headers, timelimit, maxSockets, callback) {
  const options = parse(url);
  let request;
  let Agent;
  if (options.protocol == "http:") {
    request = http.request;
    Agent = http.Agent;
  } else {
    request = https.request;
    Agent = https.Agent;
  }
  const keepAliveAgent = new Agent({ keepAlive: true, maxSockets });
  options.agent = keepAliveAgent;
  options.headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
    ...headers,
  };
  let map = {};
  let bool = true;
  function execute() {
    const req = request(options, (res) => {
      if (!map[res.statusCode]) {
        map[res.statusCode] = 1;
      } else {
        map[res.statusCode]++;
      }
      res.on("data", () => {});
      res.on("end", () => {});
      if (bool) {
        execute();
      }
    });
    req.end();
    req.on("error", () => {});
  }
  for (let i = 0; i < maxSockets * 1.5; i++) {
    execute();
  }
  setTimeout(() => {
    keepAliveAgent.requests = {};
    keepAliveAgent.destroy();
    callback(map);
  }, timelimit * 1000);
}

module.exports = worker;
