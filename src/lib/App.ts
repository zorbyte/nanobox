// External modules.
import { Server } from "http";

// Local modules.
import Router from "./Router";
import { NanoRequest, NanoResponse } from "./structures";

class App extends Router {
    // The express server.
    public server: Server;

    constructor() {
        super();
        let httpOpts: any[] = [this.run];
        if (this.supportsHttpOpts) httpOpts.unshift({
            IncomingMessage: NanoRequest,
            ServerResponse: NanoResponse,
        });
        this.server = new Server(...httpOpts);
    }

    public listen(port?: number, hostname?: string, backlog?: number, listeningListener?: (err?: Error) => void): Promise<void> | void {
        // If a callback is supplied then it will use callback syntax, otherwise Promises are used. 
        let resolveFunc = !!listeningListener ? listeningListener : Promise.resolve;
        let rejectFunc = !!listeningListener ? listeningListener : Promise.reject;

        // Listen for incomming connections.
        this.server.listen(port, hostname, backlog);

        // Listen for the appropriate events.
        this.server.once("error", rejectFunc);
        this.server.once("listening", () => {
            this.server.removeListener("error", rejectFunc);
            resolveFunc();
        });
    }
}

export default App;
