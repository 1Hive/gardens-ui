import { connect } from '@aragon/connect'
import connectHoneypot, { Proposal } from '@1hive/connect-honey-pot'

const ORG_ADDRESS = '0x0381374d658b2c2e564e954219d9a3cfc6ae3fcb'

function proposalId(proposal: Proposal): string {
  return (
    '#' +
    String(parseInt(proposal.id.match(/proposalId:(.+)$/)?.[1] || '0')).padEnd(
      2,
      ' '
    )
  )
}

async function describeProposal(proposal: Proposal): Promise<void> {
  console.log(`PROPOSAL ${proposalId(proposal)}`)
  console.log(`Name: ${proposal.name}`)
  console.log(`Link: ${proposal.link}`)
  console.log(`Requested amount: ${proposal.requestedAmount}`)
  console.log(`Beneficiary: ${proposal.beneficiary}`)
  console.log(`Stake history: `)
  console.log(proposal.stakesHistory)
  console.log(`Casts: `)
  console.log(proposal.casts)
}

async function main(): Promise<void> {
  const org = await connect(ORG_ADDRESS, 'thegraph', { network: 4 })
  console.log('\nOrganization:', org, `(${org.address})`)

  const honeypot = await connectHoneypot(org)

  if (!honeypot) {
    console.log('\nNo honeypot instance found')
    return
  }

  console.log(`\nProposals:`)
  const proposals = await honeypot.proposals()

  proposals.map(describeProposal)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
