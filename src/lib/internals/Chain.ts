import reusify = require("reusify");
import parseUrl from "parseurl";
import Holder from "./Holder";

class Chain {
    public holderPool: ReturnType<typeof reusify>;

    constructor() {
        Holder.pool = this.holderPool = reusify(Holder);
    }

    add(path = "/", fn: () => {} | [], method = "mw") {

    }

    run(req, res) {
        let _holder: Holder = this.holderPool.get();
        _holder.url = parseUrl(req);
        _holder.req = req;
        _holder.res = res;
        try {
            _holder.done();
        } catch (err) {
            req.end(err);
        }
    }
}

export default Chain;
