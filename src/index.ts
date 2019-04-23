// Local modules.
import App from "./lib/App";
import Router from "./lib/Router";
import { NanoResponse, NanoRequest } from "./lib/structures";

// Nanobox App, exporting utils and types because I'm lazy.
export = class Nanobox extends App {
    // Alias to the App.
    public static App = App;

    // Export the Router.
    public static Router = Router;

    // Export the NanoRequest structure.
    public static NanoRequest = NanoRequest;

    // Export the NanoRequest structure.
    public static NanoResponse = NanoResponse;
};
