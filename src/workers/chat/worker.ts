import { ChatRoom } from "./ChatRoom";

export { ChatRoom };

export default {
    async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
        return new Response("Chat Worker Running");
    },
};
