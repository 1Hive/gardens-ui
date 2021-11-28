"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBn = exports.bn = exports.PCT_BASE = exports.PCT_DECIMALS = void 0;
const ethers_1 = require("ethers");
exports.PCT_DECIMALS = 16; // 100% = 10^18
exports.PCT_BASE = ethers_1.BigNumber.from(`100${'0'.repeat(exports.PCT_DECIMALS)}`);
exports.bn = (x) => ethers_1.BigNumber.from(x.toString());
exports.formatBn = (number, numberDecimals, formattedDecimals = 2) => {
    const formattedNumber = ethers_1.utils.formatUnits(number, numberDecimals);
    const decimalPosition = formattedNumber.indexOf('.');
    if (decimalPosition === -1) {
        return `${formattedNumber}.${'0'.repeat(formattedDecimals)}`;
    }
    const decimals = formattedNumber.substring(decimalPosition + 1);
    const decimalsLength = decimals.length;
    if (decimalsLength <= formattedDecimals) {
        return `${formattedNumber}${'0'.repeat(formattedDecimals - decimalsLength)}`;
    }
    const integer = formattedNumber.substring(0, decimalPosition);
    const roundedDecimals = Math.round(parseInt(decimals) / 10 ** (decimalsLength - formattedDecimals));
    return `${integer}.${roundedDecimals}`;
};
//# sourceMappingURL=numbers.js.map