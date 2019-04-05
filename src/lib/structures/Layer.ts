import { TLayerFunc } from "../internals/Holder";
import pathToRegexp from "path-to-regexp";

class Layer {
    public fastRun: boolean = false;
    public pathRegexp: RegExp;
    public cleanPath: string;

    // Keys of the url.
    private keys = [];

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

    run(req, res, next) {
        req.method
    }
}

export default Layer;
