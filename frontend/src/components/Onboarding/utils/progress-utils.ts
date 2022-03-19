import { getNetworkType } from '@utils/web3-utils'
import { dataURLtoFile, textToFile } from '@utils/kit-utils'

const getStorageKey = (account: string, chainId: number) =>
  `onboarding:${getNetworkType(chainId)}:${account}`

export const getItem = (account: string, chainId: number) => {
  const item = window.localStorage.getItem(getStorageKey(account, chainId))
  return item ? JSON.parse(item) : null
}

export const removeItem = (account: string, chainId: number) => {
  window.localStorage.removeItem(getStorageKey(account, chainId))
}

export const setItem = (account: string, chainId: number, item: any) => {
  try {
    window.localStorage.setItem(
      getStorageKey(account, chainId),
      JSON.stringify(item)
    )
  } catch (error) {
    throw new Error('Disk space exceed. Clear your cache.')
  }
}

const GARDEN_ASSETS = ['logo_type', 'logo', 'token_logo']

function recoverBlob(
  file?: { content: any; blob: { path: any } },
  type = 'dataUrl'
) {
  if (file) {
    const converter = type === 'dataUrl' ? dataURLtoFile : textToFile
    return converter(file.content, file.blob.path)
  }

  return null
}

export function recoverAssets(config: {
  garden: { [x: string]: any }
  agreement: { covenantFile: any }
}) {
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
