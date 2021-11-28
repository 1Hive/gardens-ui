import Config from './Config';
import Proposal from './Proposal';
import Supporter from './Supporter';
import { Address, IHoneypotConnector, SubscriptionHandler } from '../types';
export default class Honeypot {
    #private;
    constructor(connector: IHoneypotConnector, address: Address);
    disconnect(): Promise<void>;
    config(): Promise<Config>;
    onConfig(callback: Function): SubscriptionHandler;
    proposal({ number, appAddress }?: {
        number?: string | undefined;
        appAddress?: string | undefined;
    }): Promise<Proposal>;
    onProposal({ number, appAddress }: {
        number?: string | undefined;
        appAddress?: string | undefined;
    } | undefined, callback: Function): SubscriptionHandler;
    proposals({ first, skip, orderBy, orderDirection, types, statuses, metadata }?: {
        first?: number | undefined;
        skip?: number | undefined;
        orderBy?: string | undefined;
        orderDirection?: string | undefined;
        types?: number[] | undefined;
        statuses?: number[] | undefined;
        metadata?: string | undefined;
    }): Promise<Proposal[]>;
    onProposals({ first, skip, orderBy, orderDirection, types, statuses, metadata }: {
        first?: number | undefined;
        skip?: number | undefined;
        orderBy?: string | undefined;
        orderDirection?: string | undefined;
        types?: number[] | undefined;
        statuses?: number[] | undefined;
        metadata?: string | undefined;
    } | undefined, callback: Function): SubscriptionHandler;
    supporter({ id }?: {
        id?: string | undefined;
    }): Promise<Supporter>;
    onSupporter({ id }: {
        id?: string | undefined;
    } | undefined, callback: Function): SubscriptionHandler;
}
//# sourceMappingURL=Honeypot.d.ts.map