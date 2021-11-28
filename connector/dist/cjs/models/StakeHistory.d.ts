import { IHoneypotConnector, ProposalData, StakeHistoryData, SupporterData } from '../types';
export default class StakeHistory {
    #private;
    readonly id: string;
    readonly entity: SupporterData;
    readonly proposal: ProposalData;
    readonly tokensStaked: string;
    readonly totalTokensStaked: string;
    readonly time: string;
    readonly conviction: string;
    constructor(data: StakeHistoryData, connector: IHoneypotConnector);
}
//# sourceMappingURL=StakeHistory.d.ts.map