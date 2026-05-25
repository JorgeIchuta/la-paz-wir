import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const host = "127.0.0.1";
const defaultPort = 5173;
const requestedPort = Number(process.env.PORT || defaultPort);
const shouldRetryPort = !process.env.PORT;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".webm": "audio/webm",
};

function createServer() {
  return http.createServer((request, response) => {
  const urlPath = request.url === "/" ? "/index.html" : decodeURIComponent(request.url.split("?")[0]);
  const filePath = path.normalize(path.join(root, urlPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const headers = { "Content-Type": types[extension] || "application/octet-stream" };
    if (filePath.includes(`${path.sep}assets${path.sep}`)) {
      headers["Cache-Control"] = "public, max-age=3600";
    }
    response.writeHead(200, headers);
    response.end(data);
  });
  });
}

function listen(port, attemptsLeft = 10) {
  const server = createServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && shouldRetryPort && attemptsLeft > 0) {
      console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
      listen(port + 1, attemptsLeft - 1);
      return;
    }

    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Set PORT to another value, for example: $env:PORT=5174; node src/main.mjs`);
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  });

  server.listen(port, host, () => {
    console.log(`La Paz Wir running at http://${host}:${port}`);
  });
}

listen(requestedPort);
