"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProposalId = void 0;
var time_1 = require("./time");
Object.defineProperty(exports, "toMilliseconds", { enumerable: true, get: function () { return time_1.toMilliseconds; } });
Object.defineProperty(exports, "currentTimestampEvm", { enumerable: true, get: function () { return time_1.currentTimestampEvm; } });
var numbers_1 = require("./numbers");
Object.defineProperty(exports, "bn", { enumerable: true, get: function () { return numbers_1.bn; } });
Object.defineProperty(exports, "formatBn", { enumerable: true, get: function () { return numbers_1.formatBn; } });
Object.defineProperty(exports, "PCT_BASE", { enumerable: true, get: function () { return numbers_1.PCT_BASE; } });
Object.defineProperty(exports, "PCT_DECIMALS", { enumerable: true, get: function () { return numbers_1.PCT_DECIMALS; } });
function buildProposalId(proposalNumber, appAddress) {
    return `appAddress:${appAddress}-proposalId:0x${proposalNumber.toString(16)}`;
}
exports.buildProposalId = buildProposalId;
//# sourceMappingURL=index.js.map