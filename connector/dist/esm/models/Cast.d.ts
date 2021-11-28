import { CastData, SupporterData } from '../types';
export default class Cast implements CastData {
    readonly id: string;
    readonly entity: SupporterData;
    readonly supports: boolean;
    readonly stake: string;
    readonly createdAt: string;
    constructor(data: CastData);
}
//# sourceMappingURL=Cast.d.ts.map