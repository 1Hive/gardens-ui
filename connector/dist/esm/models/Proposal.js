"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _connector;
Object.defineProperty(exports, "__esModule", { value: true });
const connect_core_1 = require("@aragon/connect-core");
class Proposal {
    constructor(data, connector) {
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        this.id = data.id;
        this.number = data.number;
        this.creator = data.creator;
        this.status = data.status;
        this.type = data.type;
        this.createdAt = data.createdAt;
        this.executedAt = data.executedAt;
        this.metadata = data.metadata;
        // proposal data
        this.link = data.link;
        this.stakes = data.stakes;
        this.stakesHistory = data.stakesHistory;
        this.beneficiary = data.beneficiary;
        this.requestedAmount = data.requestedAmount;
        this.totalTokensStaked = data.totalTokensStaked;
        this.stable = data.stable;
        //voting data
        this.setting = data.setting;
        this.startDate = data.startDate;
        this.totalPower = data.totalPower;
        this.snapshotBlock = data.snapshotBlock;
        this.yeas = data.yeas;
        this.nays = data.nays;
        this.quietEndingExtensionDuration = data.quietEndingExtensionDuration;
        this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport;
        this.script = data.script;
        this.isAccepted = data.isAccepted;
        this.casts = data.castVotes;
        //dispute data
        this.actionId = data.actionId;
        this.challengeId = data.challengeId;
        this.challenger = data.challenger;
        this.challengeEndDate = data.challengeEndDate;
        this.disputeId = data.disputeId;
        this.settledAt = data.settledAt;
        this.settlementOffer = data.settlementOffer;
        this.disputedAt = data.disputedAt;
        this.pausedAt = data.pausedAt;
        this.pauseDuration = data.pauseDuration;
        this.submitterArbitratorFeeId = data.submitterArbitratorFeeId;
        this.challengerArbitratorFeeId = data.challengerArbitratorFeeId;
    }
    async collateralRequirement() {
        return __classPrivateFieldGet(this, _connector).collateralRequirement(this.id);
    }
    onCollateralRequirement(callback) {
        return connect_core_1.subscription(callback, (callback) => __classPrivateFieldGet(this, _connector).onCollateralRequirement(this.id, callback));
    }
    async submitterArbitratorFee() {
        return __classPrivateFieldGet(this, _connector).arbitratorFee(this.submitterArbitratorFeeId || '');
    }
    onSubmitterArbitratorFee(callback) {
        return connect_core_1.subscription(callback, (callback) => __classPrivateFieldGet(this, _connector).onArbitratorFee(this.submitterArbitratorFeeId || '', callback));
    }
    async challengerArbitratorFee() {
        return __classPrivateFieldGet(this, _connector).arbitratorFee(this.challengerArbitratorFeeId || '');
    }
    onChallengerArbitratorFee(callback) {
        return connect_core_1.subscription(callback, (callback) => __classPrivateFieldGet(this, _connector).onArbitratorFee(this.challengerArbitratorFeeId || '', callback));
    }
}
exports.default = Proposal;
_connector = new WeakMap();
//# sourceMappingURL=Proposal.js.map