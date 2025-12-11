// tools.js — static demo tools for MCP
export default function registerTools(server) {

    // ---- STATIC DATA EXAMPLE ----
    const users = [
        { id: 1, name: "Mehul", email: "mehul@test.com", status: "active" },
        { id: 2, name: "John Doe", email: "john@test.com", status: "inactive" },
        { id: 3, name: "Amit", email: "amit@test.com", status: "active" }
    ];

    const products = [
        { id: 101, name: "Laptop", price: 55000 },
        { id: 102, name: "Camera", price: 75000 },
        { id: 103, name: "Mobile", price: 25000 }
    ];

    // ------------------------------------
    // TOOL 1 — Get All Users
    // ------------------------------------
    server.tool("getUsers", {}, async () => {
        return {
            content: [
                { type: "text", text: JSON.stringify(users, null, 2) }
            ]
        };
    });

    // ------------------------------------
    // TOOL 2 — Get User by ID
    // ------------------------------------
    server.tool("getUserById", { id: "number" }, async ({ id }) => {
        const u = users.find(x => x.id === id);
        return {
            content: [
                { type: "text", text: JSON.stringify(u || { error: "User not found" }, null, 2) }
            ]
        };
    });

    // ------------------------------------
    // TOOL 3 — Get All Products
    // ------------------------------------
    server.tool("getProducts", {}, async () => {
        return {
            content: [
                { type: "text", text: JSON.stringify(products, null, 2) }
            ]
        };
    });

    // ------------------------------------
    // TOOL 4 — Search Any Keyword in Users + Products
    // ------------------------------------
    server.tool("searchData", { keyword: "string" }, async ({ keyword }) => {
        keyword = keyword.toLowerCase();

        const userMatches = users.filter(u => 
            u.name.toLowerCase().includes(keyword) ||
            u.email.toLowerCase().includes(keyword)
        );

        const productMatches = products.filter(p => 
            p.name.toLowerCase().includes(keyword)
        );

        return {
            content: [
                { 
                    type: "text", 
                    text: JSON.stringify({
                        keyword,
                        userMatches,
                        productMatches
                    }, null, 2) 
                }
            ]
        };
    });

}
