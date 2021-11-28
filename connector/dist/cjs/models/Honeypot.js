"use strict";
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
var _address, _connector;
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const helpers_1 = require("../helpers");
class Honeypot {
    constructor(connector, address) {
        _address.set(this, void 0);
        _connector.set(this, void 0);
        __classPrivateFieldSet(this, _connector, connector);
        __classPrivateFieldSet(this, _address, address);
    }
    async disconnect() {
        await __classPrivateFieldGet(this, _connector).disconnect();
    }
    config() {
        return __classPrivateFieldGet(this, _connector).config(__classPrivateFieldGet(this, _address));
    }
    onConfig(callback) {
        return __classPrivateFieldGet(this, _connector).onConfig(__classPrivateFieldGet(this, _address), callback);
    }
    async proposal({ number = '', appAddress = '' } = {}) {
        const proposalId = helpers_1.buildProposalId(parseInt(number), appAddress);
        return __classPrivateFieldGet(this, _connector).proposal(proposalId);
    }
    onProposal({ number = '', appAddress = '' } = {}, callback) {
        const proposalId = helpers_1.buildProposalId(parseInt(number), appAddress);
        return __classPrivateFieldGet(this, _connector).onProposal(proposalId, callback);
    }
    async proposals({ first = 1000, skip = 0, orderBy = 'createdAt', orderDirection = 'desc', types = types_1.ALL_PROPOSAL_TYPES, statuses = types_1.ALL_PROPOSAL_STATUSES, metadata = "" } = {}) {
        return __classPrivateFieldGet(this, _connector).proposals(first, skip, orderBy, orderDirection, types, statuses, metadata);
    }
    onProposals({ first = 1000, skip = 0, orderBy = 'createdAt', orderDirection = 'desc', types = types_1.ALL_PROPOSAL_TYPES, statuses = types_1.ALL_PROPOSAL_STATUSES, metadata = "" } = {}, callback) {
        return __classPrivateFieldGet(this, _connector).onProposals(first, skip, orderBy, orderDirection, types, statuses, metadata, callback);
    }
    async supporter({ id = '' } = {}) {
        return __classPrivateFieldGet(this, _connector).supporter(id);
    }
    onSupporter({ id = '' } = {}, callback) {
        return __classPrivateFieldGet(this, _connector).onSupporter(id, callback);
    }
}
exports.default = Honeypot;
_address = new WeakMap(), _connector = new WeakMap();
//# sourceMappingURL=Honeypot.js.map