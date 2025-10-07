import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const host = "localhost";
const port = 8000;

const index_html = readFileSync("static/index.html");
const favicon_ico = readFileSync("static/favicon.ico");

const pathConfigs = [
  {
    path: "/",
    allowed_methods: ["GET"],
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(index_html);
    },
  },
  {
    path: "/favicon.ico",
    allowed_methods: ["GET"],
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end(favicon_ico);
    },
  },
];

const server = createServer((req, res) => {
  const request_url = new URL(`http://${host}${req.url}`);
  const path = request_url.pathname;
  console.log(`Request: ${req.method} ${path}`);

  let handled = false;

  for (let config of pathConfigs) {
    if (path === config.path) {
      handled = true;
      if (config.allowed_methods.includes(req.method)) {
        config.handler(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Method not allowed\n");
      }
      break;
    }
  }

  if (!handled) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Site not found!\n");
  }
});

server.listen(port, host, () => {
  console.log(`Serwer działa na http://${host}:${port}/`);
});
