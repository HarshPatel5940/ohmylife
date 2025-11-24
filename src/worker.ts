// @ts-ignore
import { default as handler } from "../.open-next/worker.js";
// Import ChatRoom from separate file to avoid bundling issues
export { ChatRoom } from "./lib/chat-room.js";

const worker = {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    if (
      url.pathname.match(/^\/api\/projects\/[^/]+\/chat$/) &&
      request.headers.get("Upgrade") === "websocket"
    ) {
      const projectId = url.pathname.split("/")[3];
      const id = env.CHAT_ROOM.idFromName(projectId);
      const stub = env.CHAT_ROOM.get(id);

      const doUrl = new URL(request.url);
      doUrl.pathname = "/websocket";

      return stub.fetch(doUrl.toString(), request);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
