"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Honeypot_1 = __importDefault(require("./models/Honeypot"));
const connector_1 = __importStar(require("./thegraph/connector"));
function connectHoneypot(organization, config) {
    var _a, _b, _c, _d, _e, _f;
    const { network, orgConnector } = organization.connection;
    const subgraphUrl = (_b = (_a = config === null || config === void 0 ? void 0 : config.subgraphUrl) !== null && _a !== void 0 ? _a : connector_1.subgraphUrlFromChainId(network.chainId)) !== null && _b !== void 0 ? _b : undefined;
    let pollInterval;
    if (orgConnector.name === 'thegraph') {
        pollInterval = (_f = (_d = (_c = config === null || config === void 0 ? void 0 : config.pollInterval) !== null && _c !== void 0 ? _c : connector_1.pollIntervalFromChainId(network.chainId)) !== null && _d !== void 0 ? _d : (_e = orgConnector.config) === null || _e === void 0 ? void 0 : _e.pollInterval) !== null && _f !== void 0 ? _f : undefined;
    }
    const HoneyPotConnector = new connector_1.default({
        pollInterval,
        subgraphUrl,
    });
    return new Honeypot_1.default(HoneyPotConnector, organization.address);
}
exports.default = connectHoneypot;
//# sourceMappingURL=connect.js.map