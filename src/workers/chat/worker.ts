import { ChatRoom } from "../../do/ChatRoom";

export { ChatRoom };

const worker = {
    async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
        return new Response("Chat Worker Running");
    },
};

export default worker;
