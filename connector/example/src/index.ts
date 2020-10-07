import { connect } from '@aragon/connect'
import connectHoneypot, {
  Config,
  Proposal,
  Supporter,
} from '@1hive/connect-honey-pot'

const ORG_ADDRESS = '0xe9869a0bbc8fb8c61b7d81c33fa2ba84871b3b0e'

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
  console.log(`Name: ${proposal.name}`)
  console.log(`Link: ${proposal.link}`)
  console.log(`Requested amount: ${proposal.requestedAmount}`)
  console.log(`Beneficiary: ${proposal.beneficiary}`)
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
  const org = await connect(ORG_ADDRESS, 'thegraph', { network: 100 })
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

  const proposals = await honeypot.proposals({ first: 10 })
  console.log(`\n#################Proposals:`)
  proposals.map(describeProposal)
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
