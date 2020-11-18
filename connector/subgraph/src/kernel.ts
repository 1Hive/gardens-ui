import { Address, DataSourceTemplate, TypedMap } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const DISPUTABLE_VOTING_ADDRESS: Address = Address.fromString(
  '0xaf5ce96c7cf99aded2f3dac7bfc3edb09f6e655c'
)
const CONIVCTION_VOTING_ADDRESS: Address = Address.fromString(
  '0x1cc247f8de4b876ab3b8ac8579a6354ed63fb468'
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
