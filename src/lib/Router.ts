import Chain from "./internals/Chain";
import { IncomingMessage, ServerResponse } from "http";

class Router {
    private chain: Chain;

    constructor() {
        this.chain = new Chain();
    }

    run(req: IncomingMessage, res: ServerResponse) {
    }

    use() {
    }
}

export default Router;
