export { toMilliseconds, currentTimestampEvm } from './time'
export { bn, formatBn, PCT_BASE, PCT_DECIMALS } from './numbers'

export function buildProposalId(proposalNumber: number, appAddress: string) {
    return `appAddress:${appAddress}-proposalId:0x${proposalNumber.toString(16)}`
  }