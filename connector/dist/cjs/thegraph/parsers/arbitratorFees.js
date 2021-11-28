"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArbitratorFee = void 0;
const ArbitratorFee_1 = __importDefault(require("../../models/ArbitratorFee"));
function parseArbitratorFee(result, connector) {
    const arbitratorFee = result.data.arbitratorFee;
    if (!arbitratorFee) {
        return null;
    }
    return new ArbitratorFee_1.default({
        id: arbitratorFee.id,
        proposalId: arbitratorFee.proposal.id,
        tokenId: arbitratorFee.token.id,
        tokenDecimals: arbitratorFee.token.decimals,
        tokenSymbol: arbitratorFee.token.symbol,
        amount: arbitratorFee.amount
    }, connector);
}
exports.parseArbitratorFee = parseArbitratorFee;
//# sourceMappingURL=arbitratorFees.js.map