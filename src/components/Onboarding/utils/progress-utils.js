import { dataURLtoFile, textToFile } from '@utils/kit-utils'
import { getNetworkType } from '@utils/web3-utils'

const getStorageKey = (account, chainId) =>
  `onboarding:${getNetworkType(chainId)}:${account}`

export const getItem = (account, chainId) => {
  const item = window.localStorage.getItem(getStorageKey(account, chainId))
  return item ? JSON.parse(item) : null
}

export const removeItem = (account) => {
  window.localStorage.removeItem(getStorageKey(account))
}

export const setItem = (account, chainId, item) => {
  window.localStorage.setItem(
    getStorageKey(account, chainId),
    JSON.stringify(item)
  )
}

const GARDEN_ASSETS = ['logo_type', 'logo', 'token_logo']

function recoverBlob(file, type = 'dataUrl') {
  if (file) {
    const converter = type === 'dataUrl' ? dataURLtoFile : textToFile
    return converter(file.content, file.blob.path)
  }

  return null
}

export function recoverAssets(config) {
  GARDEN_ASSETS.forEach((assetType) => {
    const asset = config.garden[assetType]
    if (asset) {
      asset.blob = recoverBlob(asset)
    }
  })

  const covenantAsset = config.agreement.covenantFile
  if (covenantAsset) {
    covenantAsset.blob = recoverBlob(covenantAsset, 'text')
  }

  return config
}
