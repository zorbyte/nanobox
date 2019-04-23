const PathToRegexp = require("path-to-regexp");

let PATH_SANATIZE = /[?#]/g;

class Router {
    constructor() {
        this.stack = [];
    }

    get(path, ...cbs) {

    }

    method(path, method, fn) {
        this.stack.push(new Layer(method, path, fn, Router.cbID));
        Router.cbID++;
    }

    async lookup(req, res) {
        let correctIndex = -1;
        let relevantFuncs = this.stack
            .filter(layerCandidates => layerCandidates.filterCheck(req, res));
        let relevantIt = doable.entries();
        let nextFunc = async (currentIndex, err) => {
            if (currentIndex === doable.length) return;
            if (currentIndex <= correctIndex) throw new Error("nextFunc called more than once!");
            correctIndex = currentIndex;
            let layer = relevantIt.next().value;
            if (err && err !== "route") {
                throw err;
            } else if (!layer.isMiddleware) {
                let checkArr = relevantFuncs.slice(currentIndex);
                let jumps = 0;
                while (jumps >= checkArr.length) {
                    if (checkArr[jumps].memberID !== layer.memberID) {
                        currentIndex += jumps;
                        correctIndex = currentIndex;
                        break;
                    };
                }
            }
            try {
                return layer.fn(req, res, nextFunc.bind(null, currentIndex++));
            } catch (err) {
                throw err;
            }
        };

        return await nextFn(0)
            .catch(nextErr => { throw nextErr });
    }
}

Router.cbID = 0;

class Layer {
    constructor(method, path, fn, memberID) {
        this.keys = [];
        this.method = method.toUpperCase();
        this.isMiddleware = method === "MW";
        this.fn = fn;
        this.path = path;

        // If this layer is a member of an array of callbacks.
        this.memberID = memberID;

        // Remove #s and ?s.
        let pathMatch = PATH_SANATIZE.exec(this.path);
        this.cleanPath = pathMatch
            ? this.path.substring(0, this.path.lastIndexOf(pathMatch[pathMatch.length - 1]))
            : this.path;

        // Save compute time by checking this condition.
        this.fastRun = path === "*" || path === "/";
        this.pathRegexp = !fastRun ? PathToRegexp(this.path, this.keys, {
            end: false,
            strict: false,
        }) : null;
    }

    filterCheck(req, res, nextItem) {
        return req.method === this.method && (this.fastRun || this.pathRegexp.exec(req.url.pathname));
    }
}