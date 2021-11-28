import { ArbitratorFeeData, IHoneypotConnector } from '../types';
export default class ArbitratorFee {
    #private;
    readonly id: string;
    readonly tokenId: string;
    readonly tokenDecimals: string;
    readonly tokenSymbol: string;
    readonly amount: string;
    constructor(data: ArbitratorFeeData, connector: IHoneypotConnector);
    get formattedAmount(): string;
}
//# sourceMappingURL=ArbitratorFee.d.ts.map