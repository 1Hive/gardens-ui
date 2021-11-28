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
class CollateralRequirement {
    constructor(data, connector) {
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        this.id = data.id;
        this.proposalId = data.proposalId;
        this.tokenId = data.tokenId;
        this.tokenDecimals = data.tokenDecimals;
        this.tokenSymbol = data.tokenSymbol;
        this.actionAmount = data.actionAmount;
        this.challengeAmount = data.challengeAmount;
        this.challengeDuration = data.challengeDuration;
    }
    get formattedActionAmount() {
        return helpers_1.formatBn(this.actionAmount, this.tokenDecimals);
    }
    get formattedChallengeAmount() {
        return helpers_1.formatBn(this.challengeAmount, this.tokenDecimals);
    }
}
exports.default = CollateralRequirement;
_connector = new WeakMap();
//# sourceMappingURL=CollateralRequirement.js.map