import ArbitratorFee from './models/ArbitratorFee';
import Config from './models/Config';
import CollateralRequirement from './models/CollateralRequirement';
import Proposal from './models/Proposal';
import Supporter from './models/Supporter';
export declare const ALL_PROPOSAL_TYPES: number[];
export declare const ALL_PROPOSAL_STATUSES: number[];
export declare type SubscriptionHandler = {
    unsubscribe: () => void;
};
export declare type Address = string;
export interface TokenData {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
}
export interface ConfigData {
    id: string;
    conviction: ConvictionConfigData;
    voting: VotingConfigData;
}
export interface ConvictionConfigData {
    decay: string;
    weight: string;
    maxRatio: string;
    pctBase: string;
    stakeToken: TokenData;
    requestToken: TokenData;
    maxStakedProposals: number;
    minThresholdStakePercentage: string;
    totalStaked: string;
    stableToken: TokenData;
    stableTokenOracle: string;
    contractPaused: boolean;
}
export interface VotingConfigData {
    id: string;
    token: TokenData;
    configId: string;
    voteTime: string;
    supportRequiredPct: string;
    minimumAcceptanceQuorumPct: string;
    delegatedVotingPeriod: string;
    quietEndingPeriod: string;
    quietEndingExtension: string;
    executionDelay: string;
    createdAt: string;
}
export interface StakeData {
    id: string;
    type: string;
    entity: SupporterData;
    proposal: ProposalData;
    amount: string;
    createdAt: string;
}
export interface StakeHistoryData {
    id: string;
    type: string;
    entity: SupporterData;
    proposal: ProposalData;
    tokensStaked: string;
    totalTokensStaked: string;
    conviction: string;
    time: string;
    createdAt: string;
}
export interface CastData {
    id: string;
    entity: SupporterData;
    supports: boolean;
    stake: string;
    createdAt: string;
}
export interface ProposalData {
    id: string;
    number: string;
    creator: string;
    status: string;
    type: string;
    createdAt: string;
    executedAt: string;
    metadata?: string;
    link?: string;
    stakes?: StakeData[];
    stakesHistory?: StakeHistoryData[];
    beneficiary?: string;
    requestedAmount?: string;
    totalTokensStaked?: string;
    stable?: boolean;
    setting?: VotingConfigData;
    startDate?: string;
    totalPower: string;
    snapshotBlock?: string;
    yeas?: string;
    nays?: string;
    quietEndingExtensionDuration?: string;
    quietEndingSnapshotSupport?: string;
    script?: string;
    isAccepted?: boolean;
    castVotes?: CastData[];
    actionId: string;
    challengeId: string;
    challenger: string;
    challengeEndDate: string;
    disputeId: string;
    settledAt: string;
    settlementOffer: string;
    disputedAt: string;
    pausedAt: string;
    pauseDuration: string;
    submitterArbitratorFeeId: string;
    challengerArbitratorFeeId: string;
}
export interface SupporterData {
    id: string;
    address: string;
    representative: string;
    casts: CastData[];
    stakes: StakeData[];
    stakesHistory: StakeHistoryData[];
}
export interface CollateralRequirementData {
    id: string;
    proposalId: string;
    tokenId: string;
    tokenDecimals: string;
    tokenSymbol: string;
    actionAmount: string;
    challengeAmount: string;
    challengeDuration: string;
}
export interface ArbitratorFeeData {
    id: string;
    proposalId: string;
    tokenId: string;
    tokenDecimals: string;
    tokenSymbol: string;
    amount: string;
}
export interface IHoneypotConnector {
    disconnect(): Promise<void>;
    config(id: string): Promise<Config>;
    onConfig(id: string, callback: Function): SubscriptionHandler;
    proposal(id: string): Promise<Proposal>;
    onProposal(id: string, callback: Function): SubscriptionHandler;
    proposals(first: number, skip: number, orderBy: string, orderDirection: string, types: number[], statuses: number[], metadata: string): Promise<Proposal[]>;
    onProposals(first: number, skip: number, orderBy: string, orderDirection: string, types: number[], statuses: number[], metadata: string, callback: Function): SubscriptionHandler;
    supporter(address: string): Promise<Supporter>;
    onSupporter(address: string, callback: Function): SubscriptionHandler;
    collateralRequirement(voteId: string): Promise<CollateralRequirement>;
    onCollateralRequirement(voteId: string, callback: Function): SubscriptionHandler;
    arbitratorFee(arbitratorFeeId: string): Promise<ArbitratorFee | null>;
    onArbitratorFee(arbitratorFeeId: string, callback: Function): SubscriptionHandler;
}
//# sourceMappingURL=types.d.ts.map