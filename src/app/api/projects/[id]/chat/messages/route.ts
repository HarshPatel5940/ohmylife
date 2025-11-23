import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const projectId = params.id;

    if (!env.CHAT_ROOM) {
      console.warn("CHAT_ROOM Durable Object not available (local dev)");
      return NextResponse.json([]);
    }

    const id = env.CHAT_ROOM.idFromName(projectId);
    const stub = env.CHAT_ROOM.get(id);

    const response = await stub.fetch("http://do/messages");
    if (!response.ok) {
      throw new Error(`DO returned ${response.status}`);
    }

    const messages = await response.json();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages from DO", error);

    return NextResponse.json([]);
  }
}
