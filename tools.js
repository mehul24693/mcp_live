// tools.js - Correct MCP SDK tool registration with proper schemas

import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export default function registerTools(server) {
    
    // Handler for listing available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "getUsers",
                    description: "Get a list of users",
                    inputSchema: {
                        type: "object",
                        properties: {},
                        required: []
                    }
                },
                {
                    name: "createUser",
                    description: "Create a new user",
                    inputSchema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                description: "User's name"
                            },
                            email: {
                                type: "string",
                                description: "User's email address"
                            }
                        },
                        required: ["name", "email"]
                    }
                },
                {
                    name: "getUserById",
                    description: "Get a specific user by ID",
                    inputSchema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "number",
                                description: "User ID"
                            }
                        },
                        required: ["id"]
                    }
                }
            ]
        };
    });

    // Handler for calling tools
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        console.log(`🔧 Calling tool: ${name}`, args);

        switch (name) {
            case "getUsers":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify([
                                { id: 1, name: "Alice", email: "alice@example.com" },
                                { id: 2, name: "Bob", email: "bob@example.com" },
                                { id: 3, name: "Charlie", email: "charlie@example.com" }
                            ], null, 2)
                        }
                    ]
                };

            case "createUser":
                const newUser = {
                    id: Math.floor(Math.random() * 1000) + 4,
                    name: args.name,
                    email: args.email,
                    createdAt: new Date().toISOString()
                };
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                user: newUser
                            }, null, 2)
                        }
                    ]
                };

            case "getUserById":
                const users = [
                    { id: 1, name: "Alice", email: "alice@example.com" },
                    { id: 2, name: "Bob", email: "bob@example.com" },
                    { id: 3, name: "Charlie", email: "charlie@example.com" }
                ];
                const user = users.find(u => u.id === args.id);
                
                if (!user) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    error: "User not found",
                                    id: args.id
                                }, null, 2)
                            }
                        ],
                        isError: true
                    };
                }
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(user, null, 2)
                        }
                    ]
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    });

    console.log("✅ Tools registered successfully");
}
