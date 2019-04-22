import { ServerResponse } from "http";
//import { Socket } from "net";
import NanoRequest from "./Request";

class NanoResponse extends ServerResponse {
    public body?: any;

    constructor(req: NanoRequest) {
        super(req);
    }
};


export default NanoResponse;
