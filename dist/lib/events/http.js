"use strict";
// module.exports = function (app:any, opts:any) {
//     return new PinusEvent(app, opts);
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinusEvent = void 0;
var PinusEvent = /** @class */ (function () {
    function PinusEvent(app, opts) {
    }
    PinusEvent.prototype.add_servers = function (servers) {
        //do something when application add servers
    };
    PinusEvent.prototype.remove_servers = function (ids) {
    };
    PinusEvent.prototype.replace_servers = function (servers) {
    };
    PinusEvent.prototype.bind_session = function (session) {
    };
    PinusEvent.prototype.close_session = function (session) {
    };
    return PinusEvent;
}());
exports.PinusEvent = PinusEvent;
