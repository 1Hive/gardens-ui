import { IHoneypotConnector, SubscriptionHandler } from '../types';
import ArbitratorFee from '../models/ArbitratorFee';
import CollateralRequirement from '../models/CollateralRequirement';
import Config from '../models/Config';
import Proposal from '../models/Proposal';
import Supporter from '../models/Supporter';
export declare function subgraphUrlFromChainId(chainId: number): "https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-mainnet" | "https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-rinkeby" | "https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot" | null;
export declare function pollIntervalFromChainId(chainId: number): number | null;
declare type HoneypotConnectorTheGraphConfig = {
    pollInterval?: number;
    subgraphUrl?: string;
    verbose?: boolean;
};
export default class HoneypotConnectorTheGraph implements IHoneypotConnector {
    #private;
    constructor(config: HoneypotConnectorTheGraphConfig);
    disconnect(): Promise<void>;
    config(id: string): Promise<Config>;
    onConfig(id: string, callback: Function): SubscriptionHandler;
    proposal(id: string): Promise<Proposal>;
    onProposal(id: string, callback: Function): SubscriptionHandler;
    proposals(first: number, skip: number, orderBy: string, orderDirection: string, types: number[], statuses: number[], metadata: string): Promise<Proposal[]>;
    onProposals(first: number, skip: number, orderBy: string, orderDirection: string, types: number[], statuses: number[], metadata: string, callback: Function): SubscriptionHandler;
    supporter(id: string): Promise<Supporter>;
    onSupporter(id: string, callback: Function): SubscriptionHandler;
    collateralRequirement(proposalId: string): Promise<CollateralRequirement>;
    onCollateralRequirement(proposalId: string, callback: Function): SubscriptionHandler;
    arbitratorFee(arbitratorFeeId: string): Promise<ArbitratorFee | null>;
    onArbitratorFee(arbitratorFeeId: string, callback: Function): SubscriptionHandler;
}
export {};
//# sourceMappingURL=connector.d.ts.map