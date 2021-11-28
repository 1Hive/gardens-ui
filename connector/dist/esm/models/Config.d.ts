import { ConfigData, ConvictionConfigData, IHoneypotConnector, VotingConfigData } from '../types';
export default class Config {
    #private;
    readonly id: string;
    readonly conviction: ConvictionConfigData;
    readonly voting: VotingConfigData;
    constructor(data: ConfigData, connector: IHoneypotConnector);
}
//# sourceMappingURL=Config.d.ts.map