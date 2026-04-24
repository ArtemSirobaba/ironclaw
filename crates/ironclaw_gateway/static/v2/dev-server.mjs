import http from "node:http";
import fs from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.V2_FRONTEND_PORT || process.env.PORT || 5174);
const host = process.env.V2_FRONTEND_HOST || "0.0.0.0";
const target = new URL(process.env.IRONCLAW_GATEWAY_URL || "http://127.0.0.1:3000");
const reloadClients = new Set();

const proxyPrefixes = ["/api/", "/oauth/", "/relay/", "/projects/", "/v1/"];
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
    if (requestUrl.pathname === "/__v2_reload") {
      subscribeReload(req, res);
      return;
    }

    if (proxyPrefixes.some((prefix) => requestUrl.pathname.startsWith(prefix))) {
      proxyRequest(req, res, requestUrl);
      return;
    }

    await serveV2Asset(requestUrl.pathname, res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("v2 dev server error");
  }
});

server.listen(port, host, () => {
  console.log(`IronClaw v2 frontend: http://${host}:${port}/v2`);
  console.log(`Proxying API requests to ${target.origin}`);
});

watch(root, { recursive: true }, (_eventType, filename) => {
  if (!filename || filename.includes("node_modules")) {
    return;
  }
  broadcastReload();
});

async function serveV2Asset(urlPath, res) {
  const normalizedPath = urlPath === "/" || urlPath === "/v2" ? "/v2/" : urlPath;
  if (!normalizedPath.startsWith("/v2/")) {
    res.writeHead(302, { location: "/v2/" });
    res.end();
    return;
  }

  let assetPath = decodeURIComponent(normalizedPath.slice("/v2/".length));
  if (!assetPath) {
    assetPath = "index.html";
  }

  if (assetPath.includes("\0") || assetPath.split(/[\\/]/).includes("..")) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("invalid asset path");
    return;
  }

  const filePath = path.join(root, assetPath);
  try {
    const contentType = mimeTypes.get(path.extname(filePath)) || "application/octet-stream";
    let body = await fs.readFile(filePath);
    if (assetPath === "index.html") {
      body = Buffer.from(injectReloadClient(body.toString("utf8")));
    }
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentType,
    });
    res.end(body);
  } catch (error) {
    if (error?.code === "ENOENT" && assetPath.endsWith(".css")) {
      res.writeHead(204, { "cache-control": "no-store" });
      res.end();
      return;
    }
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
}

function proxyRequest(req, res, requestUrl) {
  const upstreamUrl = new URL(requestUrl.pathname + requestUrl.search, target);
  const headers = { ...req.headers, host: target.host, origin: target.origin };

  const upstream = http.request(
    upstreamUrl,
    {
      method: req.method,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on("error", (error) => {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    res.end(`gateway proxy failed: ${error.message}`);
  });

  req.pipe(upstream);
}

function subscribeReload(req, res) {
  res.writeHead(200, {
    "cache-control": "no-store",
    "connection": "keep-alive",
    "content-type": "text/event-stream",
  });
  res.write(": connected\n\n");
  reloadClients.add(res);
  req.on("close", () => reloadClients.delete(res));
}

let reloadTimer;
function broadcastReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of reloadClients) {
      client.write("event: reload\ndata: now\n\n");
    }
  }, 75);
}

function injectReloadClient(html) {
  const script = `
    <script>
      (() => {
        const events = new EventSource("/__v2_reload");
        events.addEventListener("reload", () => location.reload());
      })();
    </script>`;
  return html.replace("</body>", `${script}\n  </body>`);
}
