import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { estimateWithQwen, getQwenRuntimeStatus } from "../lib/qwenEstimateRuntime.mjs";

const root = join(process.cwd(), "public");
const preferredPort = Number(process.env.PORT || 4173);
const host = process.env.HOST || (process.env.npm_lifecycle_event === "preview:lan" ? "0.0.0.0" : "127.0.0.1");
const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  const requested = cleanUrl === "/" ? "/preview.html" : cleanUrl;
  const fullPath = normalize(join(root, requested));
  if (!fullPath.startsWith(root)) {
    return null;
  }
  return fullPath;
}

function loadDotEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index <= 0) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 64_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(JSON.stringify(data));
}

loadDotEnvLocal();

const server = createServer(async (req, res) => {
  if ((req.url || "").split("?")[0] === "/api/estimate-drink") {
    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }

    if (req.method === "GET") {
      sendJson(res, 200, getQwenRuntimeStatus());
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method-not-allowed" });
      return;
    }

    try {
      const body = await readJsonBody(req);
      const result = await estimateWithQwen(body);
      if (!result.ok) {
        sendJson(res, result.status, {
          error: result.reason,
          message: result.message,
          fallback: result.fallback
        });
        return;
      }

      sendJson(res, 200, result.estimate);
    } catch {
      sendJson(res, 400, { error: "invalid-json", message: "请求内容不是有效 JSON。" });
    }
    return;
  }

  const fullPath = resolvePath(req.url || "/");

  if (!fullPath || !existsSync(fullPath) || !statSync(fullPath).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "content-type": mime[extname(fullPath)] || "application/octet-stream" });
  createReadStream(fullPath).pipe(res);
});

function listen(port, attemptsLeft = 20) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    const url = `http://${displayHost}:${port}/`;
    writeFileSync(join(process.cwd(), ".preview-url"), `${url}\n`, "utf8");
    console.log(`Preview ready: ${url}`);
    if (host === "0.0.0.0") {
      console.log(`LAN preview ready. Use your computer IPv4 address with port ${port}, for example: http://192.168.x.x:${port}/`);
    }
  });
}

listen(preferredPort);
