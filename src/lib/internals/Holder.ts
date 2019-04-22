// External modules.
import reusify from "reusify";
import parseUrl from "parseurl";

// Local modules.
import Chain from "./Chain";
import { NanoRequest, NanoResponse } from "../structures";

// The holder is used to hold the Chain as it is reused for every request.
// This helps speed up the request.
class Holder {
    public chainPool: ReturnType<typeof reusify>;

    constructor() {
        Chain.Pool = this.chainPool = reusify(Chain);
    }

    // Add a member to the chain stack.
    public add(path = "/", fn: () => {} | [], method = "mw") {
        // Here to resolve TSC errors.
        console.log(path, method, fn);
    }

    public run(req: NanoRequest, res: NanoResponse) {
        let chain: Chain = this.chainPool.get();
        chain.url = parseUrl(req);
        chain.req = req;
        chain.res = res;
        chain.done();
        setImmediate(() => this.chainPool.release(chain))
    }
}

export default Holder;
