"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentTimestampEvm = exports.toMilliseconds = void 0;
const numbers_1 = require("./numbers");
exports.toMilliseconds = (seconds) => parseInt(seconds) * 1000;
exports.currentTimestampEvm = () => numbers_1.bn(Math.floor(Date.now() / 1000));
//# sourceMappingURL=time.js.map