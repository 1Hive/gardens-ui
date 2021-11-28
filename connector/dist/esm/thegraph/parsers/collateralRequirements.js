"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCollateralRequirement = void 0;
const CollateralRequirement_1 = __importDefault(require("../../models/CollateralRequirement"));
function parseCollateralRequirement(result, connector) {
    const proposal = result.data.proposal;
    if (!proposal) {
        throw new Error('Unable to parse collateral requirement.');
    }
    const { collateralRequirement } = proposal;
    if (!collateralRequirement) {
        return null;
    }
    return new CollateralRequirement_1.default({
        id: collateralRequirement.id,
        proposalId: collateralRequirement.proposal.id,
        tokenId: collateralRequirement.token.id,
        tokenDecimals: collateralRequirement.token.decimals,
        tokenSymbol: collateralRequirement.token.symbol,
        actionAmount: collateralRequirement.actionAmount,
        challengeAmount: collateralRequirement.challengeAmount,
        challengeDuration: collateralRequirement.challengeDuration,
    }, connector);
}
exports.parseCollateralRequirement = parseCollateralRequirement;
//# sourceMappingURL=collateralRequirements.js.map