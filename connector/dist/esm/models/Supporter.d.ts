import { CastData, IHoneypotConnector, StakeData, StakeHistoryData, SupporterData } from '../types';
export default class Supporter implements SupporterData {
    #private;
    readonly id: string;
    readonly address: string;
    readonly representative: string;
    readonly casts: CastData[];
    readonly stakes: StakeData[];
    readonly stakesHistory: StakeHistoryData[];
    constructor(data: SupporterData, connector: IHoneypotConnector);
}
//# sourceMappingURL=Supporter.d.ts.map