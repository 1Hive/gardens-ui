"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProposal = exports.parseProposals = void 0;
const Proposal_1 = __importDefault(require("../../models/Proposal"));
const VotingConfig_1 = __importDefault(require("../../models/VotingConfig"));
function parseProposals(result, connector) {
    const proposals = result.data.proposals;
    if (!proposals) {
        throw new Error('Unable to parse proposals.');
    }
    const datas = proposals.map((proposal) => {
        var _a, _b, _c;
        // For votes (decisions)
        const casts = (_a = proposal.castVotes) === null || _a === void 0 ? void 0 : _a.map((cast) => cast);
        // For proposals (discussions and proposals)
        const stakes = (_b = proposal.stakes) === null || _b === void 0 ? void 0 : _b.map((stake) => stake);
        const stakesHistory = (_c = proposal.stakesHistory) === null || _c === void 0 ? void 0 : _c.map((stake) => stake);
        let setting = null;
        if (proposal.setting) {
            const settingData = proposal.setting;
            setting = new VotingConfig_1.default(settingData);
        }
        return {
            ...proposal,
            casts,
            stakes,
            stakesHistory,
            setting
        };
    });
    return datas.map((data) => {
        return new Proposal_1.default(data, connector);
    });
}
exports.parseProposals = parseProposals;
function parseProposal(result, connector) {
    var _a, _b, _c, _d, _e;
    const proposal = result.data.proposal;
    if (!proposal) {
        throw new Error('Unable to parse proposal.');
    }
    // For votes (decisions)
    const casts = (_a = proposal.casts) === null || _a === void 0 ? void 0 : _a.map((cast) => cast);
    // For proposals (suggestions and proposals)
    const stakes = (_b = proposal.stakes) === null || _b === void 0 ? void 0 : _b.map((stake) => stake);
    const stakesHistory = (_c = proposal.stakesHistory) === null || _c === void 0 ? void 0 : _c.map((stake) => stake);
    let setting = null;
    if (proposal.setting) {
        const settingData = proposal.setting;
        setting = new VotingConfig_1.default(settingData);
    }
    const data = {
        ...proposal,
        casts,
        stakes,
        stakesHistory,
        setting,
        submitterArbitratorFeeId: (_d = proposal.submitterArbitratorFee) === null || _d === void 0 ? void 0 : _d.id,
        challengerArbitratorFeeId: (_e = proposal.challengerArbitratorFee) === null || _e === void 0 ? void 0 : _e.id
    };
    return new Proposal_1.default(data, connector);
}
exports.parseProposal = parseProposal;
//# sourceMappingURL=proposals.js.map