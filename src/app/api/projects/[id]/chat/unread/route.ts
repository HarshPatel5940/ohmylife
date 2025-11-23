import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const projectId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const id = env.CHAT_ROOM.idFromName(projectId);
    const stub = env.CHAT_ROOM.get(id);

    const response = await stub.fetch(`http://do/unread/${userId}`);
    if (!response.ok) {
      throw new Error(`DO returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching unread count from DO", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
