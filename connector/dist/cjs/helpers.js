"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProposalId = void 0;
function buildProposalId(proposalNumber, appAddress) {
    return `appAddress:${appAddress}-proposalId:0x${proposalNumber.toString(16)}`;
}
exports.buildProposalId = buildProposalId;
//# sourceMappingURL=helpers.js.map