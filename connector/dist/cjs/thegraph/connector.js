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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _gql;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollIntervalFromChainId = exports.subgraphUrlFromChainId = void 0;
const connect_thegraph_1 = require("@aragon/connect-thegraph");
const queries = __importStar(require("./queries"));
const parsers_1 = require("./parsers");
const BLOCK_TIMES = new Map([
    [1, 13],
    [4, 14],
    [100, 5],
]);
function subgraphUrlFromChainId(chainId) {
    if (chainId === 1) {
        return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-mainnet';
    }
    if (chainId === 4) {
        return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-rinkeby';
    }
    if (chainId === 100) {
        return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot';
    }
    return null;
}
exports.subgraphUrlFromChainId = subgraphUrlFromChainId;
function pollIntervalFromChainId(chainId) {
    const blockTime = BLOCK_TIMES.get(chainId);
    return blockTime ? blockTime * 1000 : null;
}
exports.pollIntervalFromChainId = pollIntervalFromChainId;
class HoneypotConnectorTheGraph {
    constructor(config) {
        _gql.set(this, void 0);
        if (!config.subgraphUrl) {
            throw new Error('Honeypot connector requires subgraphUrl to be passed.');
        }
        __classPrivateFieldSet(this, _gql, new connect_thegraph_1.GraphQLWrapper(config.subgraphUrl, {
            pollInterval: config.pollInterval,
            verbose: config.verbose,
        }));
    }
    async disconnect() {
        __classPrivateFieldGet(this, _gql).close();
    }
    async config(id) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.CONFIG('query'), { id }, (result) => parsers_1.parseConfig(result, this));
    }
    onConfig(id, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.CONFIG('subscription'), { id }, callback, (result) => parsers_1.parseConfig(result, this));
    }
    async proposal(id) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.PROPOSAL('query'), { id }, (result) => parsers_1.parseProposal(result, this));
    }
    onProposal(id, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.PROPOSAL('subscription'), { id }, callback, (result) => parsers_1.parseProposal(result, this));
    }
    async proposals(first, skip, orderBy, orderDirection, types, statuses, metadata) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.ALL_PROPOSALS('query'), { first, skip, orderBy, orderDirection, proposalTypes: types, statuses, metadata }, (result) => parsers_1.parseProposals(result, this));
    }
    onProposals(first, skip, orderBy, orderDirection, types, statuses, metadata, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.ALL_PROPOSALS('subscription'), { first, skip, orderBy, orderDirection, proposalTypes: types, statuses, metadata }, callback, (result) => parsers_1.parseProposals(result, this));
    }
    async supporter(id) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.SUPPORTER('query'), { id }, (result) => parsers_1.parseSupporter(result, this));
    }
    onSupporter(id, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.SUPPORTER('subscription'), { id }, callback, (result) => parsers_1.parseSupporter(result, this));
    }
    async collateralRequirement(proposalId) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.COLLATERAL_REQUIREMENT('query'), { proposalId }, (result) => parsers_1.parseCollateralRequirement(result, this));
    }
    onCollateralRequirement(proposalId, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.COLLATERAL_REQUIREMENT('subscription'), { proposalId }, callback, (result) => parsers_1.parseCollateralRequirement(result, this));
    }
    async arbitratorFee(arbitratorFeeId) {
        return __classPrivateFieldGet(this, _gql).performQueryWithParser(queries.ARBITRATOR_FEE('query'), { arbitratorFeeId }, (result) => parsers_1.parseArbitratorFee(result, this));
    }
    onArbitratorFee(arbitratorFeeId, callback) {
        return __classPrivateFieldGet(this, _gql).subscribeToQueryWithParser(queries.ARBITRATOR_FEE('subscription'), { arbitratorFeeId }, callback, (result) => parsers_1.parseArbitratorFee(result, this));
    }
}
exports.default = HoneypotConnectorTheGraph;
_gql = new WeakMap();
//# sourceMappingURL=connector.js.map