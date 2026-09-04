// server.js — Production entry point for Hostinger hPanel Node.js hosting
const path = require("path");
const fs = require("fs");

const port = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = port;
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// Check if Next.js standalone build exists
const standalonePath = path.join(__dirname, ".next", "standalone", "server.js");

if (fs.existsSync(standalonePath)) {
  console.log("> Starting Slipstats via Next.js Standalone Engine...");
  require(standalonePath);
} else {
  // Standard Next.js server fallback
  console.log("> Starting Slipstats via Next.js Custom Server...");
  const { createServer } = require("http");
  const { parse } = require("url");
  const next = require("next");

  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev, dir: __dirname });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, () => {
      console.log(`> Slipstats running on http://localhost:${port}`);
    });
  });
}
