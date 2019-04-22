// External modules.
import finalHandler from "finalhandler";
import reusify from "reusify";
import { Url } from "url";

// Local modules.
import { Layer, NanoRequest, NanoResponse } from "../structures";

// Function types.
type TNextFunc = (err?: typeof Error | "route") => void;
type TLayerFunc = (req: NanoRequest, res: NanoResponse, next?: TNextFunc) => void;

// The request chain.
class Chain {
    // Chain traverse info.
    private index = 0;
    private totalLayers = 0;
    private shouldTraverse = false;
    private layers: Layer[] = [];

    // Request info, should be added to the Chain.
    public url?: Url = null;
    public req?: NanoRequest = null;
    public res?: NanoResponse = null;
    private final?: ReturnType<typeof finalHandler> = null;

    // Holder Pool info.
    public next?: Chain = null;
    public static Pool?: ReturnType<typeof reusify> = null;

    // The stacks for the chain.
    public static Stack: Layer[] = [];

    // Release the chain from the Holder Pool.
    private releasePool(possibleErr?: ErrorConstructor) {
        // Send the response.
        this.final(possibleErr);

        // Cleanup.
        this.url = null;
        this.req = null;
        this.res = null;
        this.final = null;
        this.index = 0;
        this.totalLayers = 0;
        this.layers = [];
    }

    // Not only does this start the middleware and router cycle, it also serves as a "Next Function".
    public done(err?: ErrorConstructor | "route"): void {
        try {
            // Setup the handler for when the request is completed
            this.final = finalHandler(this.req, this.res, {
                onerror: err => console.error(err.stack),
            });

            // If the stack is empty, stop the cycle.
            if (!Chain.Stack.length) return this.releasePool();

            // First round.
            if (!this.shouldTraverse) {
                // Make a placeholder variable for the RegExp result.
                let urlData: RegExpExecArray;

                // Filter the stack items to those that match the request URL.
                this.layers = Chain.Stack.filter(l => {
                    if ((this.url.pathname === "*" && l.path === "*") || (this.url.pathname === "/" && l.path === "/")) {
                        l.fastRun = true;
                    } else {
                        urlData = l.pathRegExp.exec(this.url.pathname);
                    }
                    return l.fastRun || !!urlData;
                });

                // Record the total layers to check if there is another item in the stack later.
                this.totalLayers = this.layers.length--;

                // If there are no layers, release the pool.
                if (!this.totalLayers) return this.releasePool();

                // We can now begin to traverse.
                this.shouldTraverse = true;

                // Start traversing.
                this.done();
            } else {
                // If there is an error, throw it.
                if (err && err !== "route") {
                    this.releasePool(err);
                    return;
                } else {
                    // If there are no more items left, release the pool.
                    if (this.index >= this.totalLayers) return this.releasePool();

                    // Get the current layer.
                    let currentLayer = this.layers[this.index];

                    // If route is provided to next and we are currently on a routem,
                    if (err === "route" && currentLayer.isRoute) {
                        this.index++;
                        currentLayer = this.layers[this.index];
                    };

                    // Change the index so the next cycle can use it.
                    this.index++;

                    // Run the layer.
                    currentLayer.run(this.req, this.res, this.done);

                    // This is never reached unless the entire chain is completed.
                    return this.releasePool();
                }
            }
        } catch (doneErr) {
            this.releasePool(doneErr);
        }
    }
}

export { TLayerFunc, TNextFunc };
export default Chain;
