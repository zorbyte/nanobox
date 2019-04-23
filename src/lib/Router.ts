// External modules.
import { satisfies } from "semver";
import { IncomingMessage, ServerResponse } from "http";

// Local modules.
import { Holder } from "./internals";
import { TNextFunc } from "./internals/Chain";
import { NanoRequest, NanoResponse } from "./structures";

class Router {
    // The holder to use.
    private holder!: Holder;

    // Whether or not the Node.JS version supports the HTTP Server opts object.
    protected supportsHttpOpts!: boolean;

    // HTTP methods.
    /*public get(req: NanoRequest, res: NanoResponse, next?: TNextFunc): void {
        this.run(req, res, next)
    };
    public post(req: NanoRequest, res: NanoResponse, next?: TNextFunc): void;
    public head(req: NanoRequest, res: NanoResponse, next?: TNextFunc): void;
    public options(req: NanoRequest, res: NanoResponse, next?: TNextFunc): void;
    public head() { }*/

    constructor() {
        this.supportsHttpOpts = satisfies(process.version, ">=9.6.0 | =8.12.0");
        this.holder = new Holder();
        /*this.get = (req, res, next) => { }
        this.delete = (req, res, next) => { }*/
    }

    // Run the request.
    protected run(req: NanoRequest | IncomingMessage, res: NanoResponse | ServerResponse) {
        if (!this.supportsHttpOpts) {
            if (!(req instanceof NanoRequest)) req = new NanoRequest(req.socket);
            if (!(res instanceof NanoResponse)) res = new NanoResponse(req);
        }
        // Here to resolve TSC errors.
        console.log(req, res, this.holder);
    }

    // Middleware.
    public use() { }
}

export default Router;
