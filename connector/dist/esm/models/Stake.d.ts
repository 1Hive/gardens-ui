import { ProposalData, StakeData, SupporterData } from '../types';
export default class Stake implements StakeData {
    readonly id: string;
    readonly type: string;
    readonly entity: SupporterData;
    readonly proposal: ProposalData;
    readonly amount: string;
    readonly createdAt: string;
    constructor(data: StakeData);
}
//# sourceMappingURL=Stake.d.ts.map