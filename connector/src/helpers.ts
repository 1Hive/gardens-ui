export function buildProposalId(proposalNumber: number, appAddress: string) {
  return `appAddress:${appAddress}-proposalId:0x${proposalNumber.toString(16)}`
}