import WebSocket from "ws";

async function testChat() {
    const projectId = "1";
    // Note: This URL depends on where the dev server is running. 
    // Assuming standard port 3000 for Next.js or 8787 for Wrangler.
    // Since we are testing the Worker directly (via Wrangler), it's likely 8787.
    // But the user is running Next.js which proxies to the worker? 
    // The user's error message showed: ws://localhost:8787/api/projects/1/chat
    const wsUrl = "ws://localhost:8787/api/projects/1/chat";

    console.log(`Connecting to ${wsUrl}...`);
    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
        console.log("Connected!");

        const message = {
            type: "message",
            projectId: 1,
            userId: 1,
            senderName: "Test User",
            content: "Hello from test script!"
        };

        console.log("Sending message:", message);
        ws.send(JSON.stringify(message));
    });

    ws.on("message", (data) => {
        console.log("Received message:", data.toString());
        const parsed = JSON.parse(data.toString());

        if (parsed.type === "message" && parsed.message.content === "Hello from test script!") {
            console.log("✅ Message echo received!");
            ws.close();
            process.exit(0);
        }
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
        process.exit(1);
    });

    ws.on("close", () => {
        console.log("Disconnected");
    });
}

testChat();
