"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
const Config_1 = __importDefault(require("../../models/Config"));
function parseConfig(result, connector) {
    const config = result.data.config;
    if (!config) {
        throw new Error('Unable to parse config.');
    }
    return new Config_1.default(config, connector);
}
exports.parseConfig = parseConfig;
//# sourceMappingURL=config.js.map