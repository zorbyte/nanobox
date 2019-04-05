import { IncomingMessage } from "http";
import { Socket } from "net";

class NanoRequest extends IncomingMessage {
    public body?: any;

    constructor(socket: Socket) {
        super(socket);
    }

};


export default NanoRequest;
