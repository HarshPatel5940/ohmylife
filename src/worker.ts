// @ts-ignore
import { default as handler } from "../.open-next/worker.js";
import { ChatRoom } from "./workers/chat/ChatRoom";

export default {
    fetch: handler.fetch,
};

export { ChatRoom };
