import { Address, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const DISPUTABLE_VOTING_ADDRESS: Address = Address.fromString(
  '0xaa2656f7955be77dfb26950434783ae1a489210e'
)
const CONIVCTION_VOTING_ADDRESS: Address = Address.fromString(
  '0x0cc6f0962b415788a5dca32354b5da7dedf21399'
)

const AGREEMENT_ADDRESS: Address = Address.fromString(
  '0x15d99c0ba7cd951a9cadeb9bff4d603a1af23c3c'
)

function onAppTemplateCreated(
  orgAddress: Address,
  appAddress: Address,
  appId: string
): void {
  if (CONIVCTION_VOTING_ADDRESS.equals(appAddress)) {
    loadConvictionConfig(orgAddress, appAddress)
  }
}

function processApp(
  orgAddress: Address,
  appAddress: Address,
  appId: string
): void {
  let template: string

  if (DISPUTABLE_VOTING_ADDRESS.equals(appAddress)) {
    template = 'DisputableVoting'
  } else if (CONIVCTION_VOTING_ADDRESS.equals(appAddress)) {
    template = 'ConvictionVoting'
  } else if (AGREEMENT_ADDRESS.equals(appAddress)) {
    template = 'Agreement'
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()])
    onAppTemplateCreated(orgAddress, appAddress, appId)
  }
}

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  processApp(
    event.address,
    event.params.proxy,
    event.params.appId.toHexString()
  )
}
