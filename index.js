import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NodeMcpHttpServer } from "@modelcontextprotocol/sdk/server/node-http.js";

import registerTools from "./tools.js";

const PORT = process.env.PORT || 3000;
const MCP_PATH = "/mcp";

const app = express();
app.use(express.json());

// CREATE MCP SERVER INSTANCE
const server = new McpServer({
    name: "mcp-static-demo",
    version: "1.0.0",
    description: "Static MCP server running on Render"
});

// REGISTER STATIC TOOLS
registerTools(server);

// CREATE HTTP SERVER TRANSPORT
const transport = new NodeMcpHttpServer({
    path: MCP_PATH,
    allowedOrigins: ["*"]  // open to all – for demo only
});

// CONNECT MCP SERVER TO TRANSPORT
server.connect(transport);

// ADD MCP ROUTES TO EXPRESS
app.use(MCP_PATH, transport.middleware());

// HEALTH CHECK
app.get("/health", (req, res) => {
    res.json({ ok: true, mcp: true });
});

// START EXPRESS SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🔥 Server running on http://0.0.0.0:${PORT}`);
    console.log(`➡️ MCP Endpoint: http://<your-render-url>${MCP_PATH}`);
});
