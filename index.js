import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHttpServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import registerTools from "./tools.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MCP_PATH = "/mcp";

// Create MCP server
const server = new McpServer({
    name: "mcp-static-demo",
    version: "1.0.0",
    description: "Static MCP server running on Render"
});

// Register all tools
registerTools(server);

// Create transport using the file that exists in your installation
const transport = new StreamableHttpServerTransport({
    path: MCP_PATH,
    allowedOrigins: ["*"]
});

// Connect MCP server
server.connect(transport);

// Use middleware
if (transport.middleware) {
    app.use(MCP_PATH, transport.middleware());
} else {
    console.error("❌ transport.middleware() not found — SDK changed again.");
}

// Health route
app.get("/health", (req, res) => {
    res.json({ ok: true, mcp: true });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🔥 Server running http://0.0.0.0:${PORT}`);
    console.log(`➡️ MCP endpoint: http://<your-domain>${MCP_PATH}`);
});
