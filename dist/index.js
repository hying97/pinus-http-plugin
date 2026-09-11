"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomeloExports = exports.createPinusHttpPlugin = exports.PinusHttpPlugin = void 0;
var http_1 = require("./lib/components/http");
var PinusHttpPlugin = /** @class */ (function () {
    function PinusHttpPlugin() {
        this.name = 'PinusHttp';
        this.components = [http_1.PinusHttp];
    }
    return PinusHttpPlugin;
}());
exports.PinusHttpPlugin = PinusHttpPlugin;
function createPinusHttpPlugin() {
    return new PinusHttpPlugin();
}
exports.createPinusHttpPlugin = createPinusHttpPlugin;
exports.PomeloExports = {
    components: __dirname + '/lib/components/',
    events: __dirname + '/lib/events/'
};
