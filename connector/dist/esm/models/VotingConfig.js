"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class Setting {
    constructor(data) {
        this.id = data.id;
        this.token = data.token.id;
        this.configId = data.configId;
        this.voteTime = data.voteTime;
        this.supportRequiredPct = data.supportRequiredPct;
        this.minimumAcceptanceQuorumPct = data.minimumAcceptanceQuorumPct;
        this.delegatedVotingPeriod = data.delegatedVotingPeriod;
        this.quietEndingPeriod = data.quietEndingPeriod;
        this.quietEndingExtension = data.quietEndingExtension;
        this.executionDelay = data.executionDelay;
        this.createdAt = data.createdAt;
    }
    get formattedSupportRequiredPct() {
        return helpers_1.formatBn(this.supportRequiredPct, helpers_1.PCT_DECIMALS);
    }
    get formattedMinimumAcceptanceQuorumPct() {
        return helpers_1.formatBn(this.minimumAcceptanceQuorumPct, helpers_1.PCT_DECIMALS);
    }
}
exports.default = Setting;
//# sourceMappingURL=VotingConfig.js.map