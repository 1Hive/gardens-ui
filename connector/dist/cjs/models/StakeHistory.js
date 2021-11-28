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
class StakeHistory {
    constructor(data, connector) {
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        this.id = data.id;
        this.entity = data.entity;
        this.proposal = data.proposal;
        this.tokensStaked = data.tokensStaked;
        this.totalTokensStaked = data.totalTokensStaked;
        this.time = data.time;
        this.conviction = data.conviction;
    }
}
exports.default = StakeHistory;
_connector = new WeakMap();
//# sourceMappingURL=StakeHistory.js.map