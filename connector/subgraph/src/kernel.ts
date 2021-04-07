import { Address, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const DISPUTABLE_VOTING_ADDRESS: Address = Address.fromString(
  '0xfbd0b2726070a9d6aff6d7216c9e9340eae68b2a'
)
const CONIVCTION_VOTING_ADDRESS: Address = Address.fromString(
  '0x0b21081c6f8b1990f53fc76279cc41ba22d7afe2'
)

const AGREEMENT_ADDRESS: Address = Address.fromString(
  '0x59a15718992a42082ab2306bc6cbd662958a178c'
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
