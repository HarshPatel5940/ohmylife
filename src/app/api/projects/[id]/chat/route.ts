import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const projectId = params.id;

        const id = env.CHAT_ROOM.idFromName(projectId);
        const stub = env.CHAT_ROOM.get(id);


        const url = new URL(request.url);
        url.pathname = "/websocket";

        return stub.fetch(url.toString(), request);
    } catch (error) {
        console.error("Error connecting to chat room", error);
        return new Response("Internal server error", { status: 500 });
    }
}
