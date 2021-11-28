"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stake {
    constructor(data) {
        this.id = data.id;
        this.type = data.type;
        this.entity = data.entity;
        this.proposal = data.proposal;
        this.amount = data.amount;
        this.createdAt = data.createdAt;
    }
}
exports.default = Stake;
//# sourceMappingURL=Stake.js.map