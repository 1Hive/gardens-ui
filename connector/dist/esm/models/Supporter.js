"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _connector;
Object.defineProperty(exports, "__esModule", { value: true });
class Supporter {
    constructor(data, connector) {
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        this.id = data.id;
        this.address = data.address;
        this.representative = data.representative;
        this.casts = data.casts;
        this.stakes = data.stakes;
        this.stakesHistory = data.stakesHistory;
    }
}
exports.default = Supporter;
_connector = new WeakMap();
//# sourceMappingURL=Supporter.js.map