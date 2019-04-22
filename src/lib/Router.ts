// External modules.
import { satisfies } from "semver";
import { IncomingMessage, ServerResponse } from "http";

// Local modules.
import { Holder } from "./internals/";
import { NanoRequest, NanoResponse } from "./structures";

class Router {
    // The holder to use.
    private holder: Holder;

    // Whether or not the Node.JS version supports the HTTP Server opts object.
    protected supportsHttpOpts!: boolean;

    // HTTP methods.
    public get() { }
    public post() { }
    public head() { }

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
