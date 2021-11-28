"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSupporter = void 0;
const Supporter_1 = __importDefault(require("../../models/Supporter"));
function parseSupporter(result, connector) {
    const supporter = result.data.supporter;
    if (!supporter) {
        return null;
    }
    // For votes (decisions)
    const casts = supporter.casts.map((cast) => cast);
    // For proposals (suggestions and proposals)
    const stakes = supporter.stakes.map((stake) => stake);
    const stakesHistory = supporter.stakesHistory.map((stake) => stake);
    return new Supporter_1.default({
        ...supporter,
        casts,
        stakes,
        stakesHistory
    }, connector);
}
exports.parseSupporter = parseSupporter;
//# sourceMappingURL=supporter.js.map