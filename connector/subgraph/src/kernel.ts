import { Address, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const DISPUTABLE_VOTING_ADDRESS: Address = Address.fromString(
  '0x3926843504456ece3706339a296693fb735f5493'
)
const CONIVCTION_VOTING_ADDRESS: Address = Address.fromString(
  '0x6f433308e2a092f269028f4b220bbc22b5230194'
)

const AGREEMENT_ADDRESS: Address = Address.fromString(
  '0x8a9893db28fe41bcafc07c9c4da73a6a85d3732c'
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
  } else {
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
