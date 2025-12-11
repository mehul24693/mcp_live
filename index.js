// index.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHttpServerTransport } from "@modelcontextprotocol/sdk/server/streamable-http.js";

import registerTools from "./tools.js";

const app = express();
app.use(express.json());

// -------------------------------
// SERVER CONFIG
// -------------------------------
const PORT = process.env.PORT || 3000;
const MCP_PATH = "/mcp";

const server = new McpServer({
    name: "mcp-static-demo",
    version: "1.0.0",
    description: "Static data MCP Server hosted on Render.com"
});

// Register all demo tools
registerTools(server);

// -------------------------------
// MCP TRANSPORT (HTTP)
// -------------------------------
const transport = new StreamableHttpServerTransport({
    path: MCP_PATH,
    allowedOrigins: ["*"]  // allow all for demo
});

server.connect(transport);

// Attach MCP route to Express if middleware() exists
if (typeof transport.middleware === "function") {
    app.use(MCP_PATH, transport.middleware());
}

// Health check
app.get("/health", (req, res) => res.json({ ok: true, mcp: true }));

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🔥 MCP Static Server running on http://0.0.0.0:${PORT}`);
    console.log(`➡️  MCP Endpoint: http://<your-render-url>${MCP_PATH}`);
});
