import { TLayerFunc, TNextFunc } from "../internals/Chain";
import pathToRegexp from "path-to-regexp";
import { NanoRequest, NanoResponse } from ".";

class Layer {
    public fastRun: boolean = false;
    public pathRegexp: RegExp;
    public cleanPath: string;

    // Keys of the url.
    private keys: any[] = [];

    constructor(public path = "/", public fn?: TLayerFunc | TLayerFunc[], public isRoute = false) {
        let regexMatch = /[?#]/g.exec(path);
        if (regexMatch) {
            this.cleanPath = path.substring(0, path.lastIndexOf(regexMatch[regexMatch.length - 1]));
        } else {
            this.cleanPath = this.path;
        }
        this.pathRegexp = pathToRegexp(this.cleanPath, this.keys, {
            end: false,
            strict: false,
        });
    }

    public run(req: NanoRequest, res: NanoResponse, next: TNextFunc) {
        // Here to resolve TSC errors.
        console.log(req, res, next);
    }
}

export default Layer;
