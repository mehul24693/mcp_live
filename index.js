import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NodeHttpTransport } from "@modelcontextprotocol/sdk/server/node-http.js";

import registerTools from "./tools.js";

const app = express();
app.use(express.json());

// CONFIG
const PORT = process.env.PORT || 3000;
const MCP_PATH = "/mcp";

// MCP SERVER
const server = new McpServer({
  name: "mcp-static-demo",
  version: "1.0.0",
  description: "Static data MCP Server hosted on Render.com"
});

// Load tools
registerTools(server);

// HTTP Transport
const transport = new NodeHttpTransport({
  path: MCP_PATH,
  allowedOrigins: ["*"]
});

server.connect(transport);

// Bind Express
if (typeof transport.middleware === "function") {
  app.use(MCP_PATH, transport.middleware());
} else {
  console.log("⚠️ WARNING: transport.middleware not available. SDK version changed.");
}

// Health
app.get("/health", (req, res) => res.json({ ok: true, mcp: true }));

// Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Running on http://0.0.0.0:${PORT}`);
  console.log(`MCP endpoint → http://<render-url>${MCP_PATH}`);
});
