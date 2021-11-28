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
const helpers_1 = require("../helpers");
class ArbitratorFee {
    constructor(data, connector) {
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        this.id = data.id;
        this.tokenId = data.tokenId;
        this.tokenDecimals = data.tokenDecimals;
        this.tokenSymbol = data.tokenSymbol;
        this.amount = data.amount;
    }
    get formattedAmount() {
        return helpers_1.formatBn(this.amount, this.tokenDecimals);
    }
}
exports.default = ArbitratorFee;
_connector = new WeakMap();
//# sourceMappingURL=ArbitratorFee.js.map