import { connect } from '@aragon/connect'
import connectHoneypot, {
  Config,
  Proposal,
  Supporter,
} from '@1hive/connect-honey-pot'

const ORG_ADDRESS = '0x105b0ec40228b9f6c5a2a1e64f70b7965f1b6323'

function proposalId(proposal: Proposal): string {
  return (
    '#' +
    String(parseInt(proposal.id.match(/proposalId:(.+)$/)?.[1] || '0')).padEnd(
      2,
      ' '
    )
  )
}

function describeProposal(proposal: Proposal): void {
  console.log(`PROPOSAL ${proposalId(proposal)} ${proposal.type}`)
  console.log(`Name: ${proposal.metadata}`)
  console.log(`Link: ${proposal.link}`)
  console.log(`Requested amount: ${proposal.requestedAmount}`)
  console.log(`Beneficiary: ${proposal.beneficiary}`)
  console.log(`Status: ${proposal.status}`)
  console.log(`Voting Settings: ${JSON.stringify(proposal.setting)}`)
  console.log(`Submitter Arbitrator Fee: ${proposal.submitterArbitratorFeeId}`)
  console.log(`Challenger Arbitrator Fee: ${proposal.challengerArbitratorFeeId}`)
  console.log(`Stable unit : ${proposal.stable}`)
  console.log(`Casts : ${JSON.stringify(proposal.casts)}`)

  // console.log(`Stake history: `)
  // console.log(JSON.stringify(proposal.stakesHistory, null, 2))
  // console.log(`Casts: `)
  // console.log(JSON.stringify(proposal.casts, null, 2))
  console.log(`\n`)
}

function describeConfig(config: Config): void {
  console.log(
    `Conviction config: ${JSON.stringify(config.conviction, null, 2)}`
  )
  console.log(`Voting config: ${JSON.stringify(config.voting, null, 2)}`)
}

function describeSupporter(supporter: Supporter): void {
  console.log('SUPPORTER', supporter.address)
  console.log(`casts: ${JSON.stringify(supporter.casts, null, 2)}`)
  console.log(`stakes: ${JSON.stringify(supporter.stakes, null, 2)}`)
  console.log(
    `stakes history: ${JSON.stringify(supporter.stakesHistory, null, 2)}`
  )
}

async function main(): Promise<void> {
  const org = await connect(ORG_ADDRESS, 'thegraph', { network: 4 })
  console.log('\n##################Organization:', org, `(${org.address})`)

  const honeypot = await connectHoneypot(org)

  if (!honeypot) {
    console.log('\nNo honeypot instance found')
    return
  }

  const config = await honeypot.config()
  console.log(`\n#################Config:`)
  describeConfig(config)
  console.log(`\n`)

  const proposals = await honeypot.proposals({ first: 100 })
  console.log(`\n#################Proposals:`)
  proposals.map(describeProposal)
  console.log(`\n`)

  // const proposal = await honeypot.proposal({
  //   number: '1',
  //   appAddress: '0x00f9092e5806628d7a44e496c503cec608e64f1f',
  // })
  // console.log(`\n#################Unique Proposal:`)
  // describeProposal(proposal)
  console.log(`\n`)

  // console.log(`#####Subscriptions\n\n`)
  // honeypot.onProposals({}, (err: any, proposals) => {
  //   console.log('proposals', proposals)
  //   if (err || !proposals) {
  //     return
  //   }

  //   proposals.map(describeProposal)
  // })

  // honeypot.onConfig((err: any, config) => {
  //   console.log('config', config)
  //   if (err || !config) {
  //     return
  //   }

  //   describeConfig(config)
  // })
}

main().catch(err => {
  console.error('')
  console.error(err)
  console.log(
    'Please report any problem to https://github.com/aragon/connect/issues'
  )
  process.exit(1)
})
