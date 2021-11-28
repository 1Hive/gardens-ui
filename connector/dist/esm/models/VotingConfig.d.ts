import { VotingConfigData } from '../types';
export default class Setting {
    readonly id: string;
    readonly token: string;
    readonly configId: string;
    readonly voteTime: string;
    readonly supportRequiredPct: string;
    readonly minimumAcceptanceQuorumPct: string;
    readonly delegatedVotingPeriod: string;
    readonly quietEndingPeriod: string;
    readonly quietEndingExtension: string;
    readonly executionDelay: string;
    readonly createdAt: string;
    constructor(data: VotingConfigData);
    get formattedSupportRequiredPct(): string;
    get formattedMinimumAcceptanceQuorumPct(): string;
}
//# sourceMappingURL=VotingConfig.d.ts.map