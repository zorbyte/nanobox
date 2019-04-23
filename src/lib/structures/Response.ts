// External modules.
import { IncomingMessage, ServerResponse } from "http";

// Local modules.
import { NanoRequest } from ".";

class NanoResponse extends ServerResponse {
    public body?: any;

    constructor(req: NanoRequest | IncomingMessage) {
        super(req);
    }
};


export default NanoResponse;
