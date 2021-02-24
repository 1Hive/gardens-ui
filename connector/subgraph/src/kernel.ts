import { Address, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const DISPUTABLE_VOTING_ADDRESS: Address = Address.fromString(
  '0x05fb05d70315cde1e9c3a026e81055d6f2811766'
)
const CONIVCTION_VOTING_ADDRESS: Address = Address.fromString(
  '0x16ac9a05d59fcbe45bdb1faa4870268a8bd8e7a7'
)

const AGREEMENT_ADDRESS: Address = Address.fromString(
  '0xc08d59bfe2337d45fa5e77ad8d683fd5bdfcde95'
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
