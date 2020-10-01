import { Address, DataSourceTemplate, TypedMap } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig, loadVotingConfig } from './helpers'

const DANDELION_VOTING_APP_IDS: string[] = [
  '0x2d7442e1c4cb7a7013aecc419f938bdfa55ad32d90002fb92ee5969e27b2bf07', // dandelion-voting.aragonpm.eth
  '0x40a80c4b4050993512df39c802adec62dafeb1f0586cc15f4d34bda9c47ba468',  // gardens-dandelion-voting.open.aragonpm.eth 
  '0x82d8d87cd48f4b245d5c8c1c98c5d527dc7b7e166f62471569fb8b1061900644'  // dandelion-voting.1hive.aragonpm.eth
]
const CONIVCTION_VOTING_APP_IDS: string[] = [
  '0xabb88ccde8e73f80a3f4a14ef4f6bbfcc19f172a073a5d4cace3af06a8f2a182', // conviction-beta.aragonpm.eth
  '0xe4691f497f5e74daf61612cea2d5a540b095805872218eaa9108aa5fd76779a2'  // conviction-beta.open.aragonpm.eth
]

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  processApp(event.address, event.params.proxy, event.params.appId.toHexString())
}
  
 function processApp(orgAddress: Address, appAddress: Address, appId: string): void {
    let template: string

    if (DANDELION_VOTING_APP_IDS.includes(appId)) {
      template = 'DandelionVoting'
    } else if (CONIVCTION_VOTING_APP_IDS.includes(appId)) {
      template = 'ConvictionVoting'
    }

    if (template) {
      DataSourceTemplate.create(template, [appAddress.toHexString()])
      onAppTemplateCreated(orgAddress, appAddress, appId)
    }
}

function onAppTemplateCreated(orgAddress: Address, appAddress: Address, appId: string): void {
  if (CONIVCTION_VOTING_APP_IDS.includes(appId)) {
    loadConvictionConfig(orgAddress, appAddress)
    return 
  }

  if (DANDELION_VOTING_APP_IDS.includes(appId)) {
    loadVotingConfig(orgAddress, appAddress)
  } 
}
