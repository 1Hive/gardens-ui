import { Organization } from '@aragon/connect-core';
import HonyePot from './models/Honeypot';
declare type Config = {
    subgraphUrl: string;
    pollInterval?: number;
};
export default function connectHoneypot(organization: Organization, config?: Config): HonyePot;
export {};
//# sourceMappingURL=connect.d.ts.map