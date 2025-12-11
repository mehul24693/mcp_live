export default function registerTools(server) {

    const users = [
        { id: 1, name: "Mehul", email: "mehul@example.com", status: "active" },
        { id: 2, name: "John", email: "john@example.com", status: "inactive" }
    ];

    const products = [
        { id: 101, name: "Laptop", price: 55000 },
        { id: 102, name: "Camera", price: 75000 }
    ];

    // Get all users
    server.tool("getUsers", {}, async () => {
        return {
            content: [{ type: "json", json: users }]
        };
    });

    // Get user by ID
    server.tool("getUserById", {
        id: "number"
    }, async ({ id }) => {
        const u = users.find(x => x.id === id);
        return {
            content: [{ type: "json", json: u || { error: "User not found" } }]
        };
    });

    // Get all products
    server.tool("getProducts", {}, async () => {
        return {
            content: [{ type: "json", json: products }]
        };
    });

    // Search
    server.tool("searchData", {
        keyword: "string"
    }, async ({ keyword }) => {
        const key = keyword.toLowerCase();

        const userMatches = users.filter(x =>
            x.name.toLowerCase().includes(key) ||
            x.email.toLowerCase().includes(key)
        );

        const productMatches = products.filter(x =>
            x.name.toLowerCase().includes(key)
        );

        return {
            content: [{
                type: "json",
                json: { keyword, userMatches, productMatches }
            }]
        };
    });
}
