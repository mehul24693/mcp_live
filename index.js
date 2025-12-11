import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import registerTools from "./tools.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Create MCP server instance
const mcpServer = new Server({
    name: "mcp-static-demo",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {}
    }
});

// Register tools
registerTools(mcpServer);

// SSE endpoint for MCP connections
app.get("/sse", async (req, res) => {
    console.log("📡 New SSE connection established");
    
    const transport = new SSEServerTransport("/messages", res);
    await mcpServer.connect(transport);
    
    req.on("close", () => {
        console.log("🔌 SSE connection closed");
    });
});

// Message endpoint for SSE transport
app.post("/messages", async (req, res) => {
    // SSE transport handles this internally
    res.status(202).end();
});

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        ok: true, 
        mcp: true,
        server: "mcp-static-demo",
        version: "1.0.0"
    });
});

// Root with info and test interface
app.get("/", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MCP Server</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 900px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-top: 0; }
                .endpoint {
                    background: #f8f9fa;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 5px;
                    border-left: 4px solid #007bff;
                }
                code {
                    background: #e9ecef;
                    padding: 3px 8px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }
                .status {
                    display: inline-block;
                    padding: 5px 15px;
                    background: #28a745;
                    color: white;
                    border-radius: 20px;
                    font-size: 14px;
                }
                pre {
                    background: #282c34;
                    color: #abb2bf;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                .config {
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔧 MCP Server</h1>
                <span class="status">● Running</span>
                
                <h2>Server Information</h2>
                <p><strong>Name:</strong> mcp-static-demo</p>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Base URL:</strong> <code>${baseUrl}</code></p>
                
                <h2>Endpoints</h2>
                
                <div class="endpoint">
                    <strong>SSE Connection:</strong><br>
                    <code>GET ${baseUrl}/sse</code><br>
                    <small>Server-Sent Events endpoint for MCP protocol</small>
                </div>
                
                <div class="endpoint">
                    <strong>Messages:</strong><br>
                    <code>POST ${baseUrl}/messages</code><br>
                    <small>Message endpoint for SSE transport</small>
                </div>
                
                <div class="endpoint">
                    <strong>Health Check:</strong><br>
                    <code>GET ${baseUrl}/health</code><br>
                    <small>Server health status</small>
                </div>
                
                <h2>Claude Desktop Configuration</h2>
                <div class="config">
                    <p>To use this MCP server with Claude Desktop, add this to your config:</p>
                    <strong>MacOS:</strong> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code><br>
                    <strong>Windows:</strong> <code>%APPDATA%\\Claude\\claude_desktop_config.json</code>
                </div>
                
                <pre>{
  "mcpServers": {
    "mcp-static-demo": {
      "url": "${baseUrl}/sse"
    }
  }
}</pre>

                <h2>Available Tools</h2>
                <ul>
                    <li><strong>getUsers</strong> - Get a list of all users</li>
                    <li><strong>createUser</strong> - Create a new user (requires name and email)</li>
                    <li><strong>getUserById</strong> - Get a specific user by ID</li>
                </ul>

                <h2>Testing</h2>
                <p>Once configured in Claude Desktop, you can ask Claude things like:</p>
                <ul>
                    <li>"Get me the list of users"</li>
                    <li>"Create a new user named John with email john@example.com"</li>
                    <li>"Get user with ID 1"</li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔥 MCP Server Running                                      ║
╠════════════════════════════════════════════════════════════╣
║  📍 Server:     http://0.0.0.0:${PORT}                        ║
║  📡 SSE:        http://0.0.0.0:${PORT}/sse                    ║
║  💚 Health:     http://0.0.0.0:${PORT}/health                 ║
║  🌐 Info:       http://0.0.0.0:${PORT}/                       ║
╚════════════════════════════════════════════════════════════╝
    `);
});
