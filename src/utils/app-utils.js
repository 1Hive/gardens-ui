import { getIpfsUrlFromUri } from './ipfs-utils'
import iconAcl from '../assets/icon-acl.svg'
import iconKernel from '../assets/icon-kernel.svg'
import iconRegistry from '../assets/icon-registry.svg'

// TODO: Replace with information supplied by connect when available
// https://github.com/aragon/connect/pull/259
export const KNOWN_SYSTEM_APPS = new Map([
  [
    '0x3b4bf6bf3ad5000ecf0f989d5befde585c6860fea3e574a4fab4c49d1c177d9c',
    {
      humanName: 'Kernel',
      iconSrc: iconKernel,
    },
  ],
  [
    '0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a',
    {
      humanName: 'ACL',
      iconSrc: iconAcl,
    },
  ],
  [
    '0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61',
    {
      humanName: 'EVM Script Registry',
      iconSrc: iconRegistry,
    },
  ],
])

export function getAppPresentationByAddress(apps, appAddress) {
  const app = apps.find(({ address }) => address === appAddress)

  return getAppPresentation(app)
}

export function getAppPresentation(app) {
  const { contentUri, name, manifest, appId } = app
  // Get human readable name and icon from manifest if available
  if (manifest && contentUri) {
    const { name: humanName, icons } = manifest
    const iconPath = icons && icons[0].src

    return {
      humanName,
      iconSrc: iconPath ? getIpfsUrlFromUri(contentUri) + iconPath : '',
      name,
    }
  }

  // System apps don't have icons or human readable names
  // so we get them via a static mapping instead
  return KNOWN_SYSTEM_APPS.get(appId) || null
}

export function getDisputableAppByName(apps, appName) {
  return apps?.find(app => app.appName === appName)
}
