import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: { key: string[] } }
) {
    try {
        const key = params.key.join("/");
        const { env } = getCloudflareContext();

        const object = await env.BUCKET.get(key);

        if (!object) {
            return new NextResponse("File not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);

        return new NextResponse(object.body, {
            headers,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
