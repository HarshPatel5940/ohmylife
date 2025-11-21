// @ts-ignore
import { default as handler } from "../.open-next/worker.js";

const worker = {
    async fetch(request: Request, env: any, ctx: any) {
        return handler.fetch(request, env, ctx);
    }
};

export default worker;
