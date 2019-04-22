// Local modules.
import { Holder } from "./internals/";
import { NanoRequest, NanoResponse } from "./structures";

import { satisfies } from "semver";
import { IncomingMessage, ServerResponse } from "http";

class Router {
    private holder: Holder;
    protected supportsHttpOpts!: boolean;

    public get() { }
    public post() { }
    public head() { }
    public ["m-search"]() {}

    public [get|put|post|patch|delete|del]() {}

    constructor() {
        this.supportsHttpOpts = satisfies(process.version, ">=9.6.0 | =8.12.0");
        this.holder = new Holder();
    }

    protected run(req: NanoRequest | IncomingMessage, res: NanoResponse | ServerResponse) {
        // Here to resolve TSC errors.
        console.log(req, res, this.holder);
    }

    // Middleware.
    public use() {}
}

export default Router;
