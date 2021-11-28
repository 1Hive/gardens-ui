import { CollateralRequirementData, IHoneypotConnector } from '../types';
export default class CollateralRequirement {
    #private;
    readonly id: string;
    readonly proposalId: string;
    readonly tokenId: string;
    readonly tokenDecimals: string;
    readonly tokenSymbol: string;
    readonly actionAmount: string;
    readonly challengeAmount: string;
    readonly challengeDuration: string;
    constructor(data: CollateralRequirementData, connector: IHoneypotConnector);
    get formattedActionAmount(): string;
    get formattedChallengeAmount(): string;
}
//# sourceMappingURL=CollateralRequirement.d.ts.map