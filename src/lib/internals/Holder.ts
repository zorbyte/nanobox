import { IncomingMessage, ServerResponse, OutgoingMessage } from "http";
import reusify from "reusify";
import { Url } from "url";
import Layer from "../structures/Layer";

type TNextFunc = (err?: typeof Error | "route") => void;

type TLayerFunc = (req: IncomingMessage, res: ServerResponse, next?: TNextFunc) => void;

class Holder {
    // Holder traverse info.
    private index = 0;
    private totalLayers = 0;
    private layers: Layer[] = [];

    // Request info, should be added to Holder.
    public url: Url;
    public req: IncomingMessage = null;
    public res: ServerResponse = null;

    // Pool info.
    public next: Holder;
    public static pool: ReturnType<typeof reusify>;

    // The stacks for the holder.
    public static stack: Layer[];

    // Release the holder from the pool.
    private releasePool() {
        let req = this.req;
        let res = this.res;
        this.url = null;
        this.req = null;
        this.res = null;
        this.index = 0;
        this.totalLayers = 0;
        this.layers = [];
        Holder.pool.release(this);
        return { req, res };
    }

    public done(err?: typeof Error | "route"): {
        req: IncomingMessage,
        res: OutgoingMessage,
    } | void {
        if (!Holder.stack.length) return this.releasePool();

        // First round.
        if (!this.index) {
            let urlData: RegExpExecArray;
            this.layers = Holder.stack.filter(l => {
                if ((this.url.pathname === "*" && l.path === "*") || (this.url.pathname === "/" && l.path === "/")) {
                    l.fastRun = true;
                } else {
                    urlData = l.pathRegexp.exec(this.url.pathname);
                }
                return l.fastRun || !!urlData;
            });
            this.totalLayers = this.layers.length--;
            if (!this.totalLayers) return this.releasePool();
            this.done();
        } else {
            if (err && err !== "route") {
                throw { ...this.releasePool(), err };
            } else {
                if (this.index >= this.totalLayers) return this.releasePool();
                let currentLayer = this.layers[this.index];
                if (err === "route" && currentLayer.isRoute) this.index++;
                this.layers[this.index].run(this.req, this.res, this.done);
                this.index++;
            }
        }
    }
}

export { TLayerFunc, TNextFunc };
export default Holder;
