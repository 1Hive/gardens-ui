import { CONTEXT_ID } from '../constants'
import { NO_CONTENT } from './responseCodes'
import env from '../environment'
import { sponsor } from 'brightid_sdk_v5'

export async function sponsorUser(account) {
  const privateKey = env('NODE_PK')

  if (!privateKey) {
    return { error: 'No private key found for the node' }
  }

  try {
    await sponsor(privateKey, CONTEXT_ID, account)
  } catch (err) {
    if (err.code === NO_CONTENT) {
      return {
        error: null,
      }
    }
    return {
      error: err.errorMessage,
    }
  }
}
