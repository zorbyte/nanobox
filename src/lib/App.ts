import { EventEmitter } from "events";
import Router from "./Router";
import { Server } from "http";
import NanoRequest from "./structures/Request";

type TListenReturn<T> = T extends undefined ? void : PromiseLike<void>;

class App extends Router {
    private emitter: EventEmitter;
    public server: Server;

    constructor() {
        super();
        this.server = new Server({
            IncomingMessage: NanoRequest,
        }, this.run);
    }

    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: (err?: Error) => void): TListenReturn<typeof listeningListener> {
        let resolveFunc = !!listeningListener ? listeningListener : Promise.resolve;
        let rejectFunc = !!listeningListener ? listeningListener : Promise.reject;

        this.server.listen(port, hostname, backlog);
        this.server.once("error", rejectFunc);
        this.server.once("listening", () => {
            this.server.removeListener("error", rejectFunc);
            resolveFunc();
        });

        return;
    }
}

export default App;
