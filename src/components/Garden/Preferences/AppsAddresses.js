import React from 'react'

import {
  Box,
  Field,
  GU,
  IdentityBadge,
  Info,
  LoadingRing,
  useLayout,
} from '@1hive/1hive-ui'

import { KNOWN_SYSTEM_APPS, SHORTENED_APPS_NAMES } from '@utils/app-utils'

import { useConnectedGarden } from '@providers/ConnectedGarden'

import { getNetwork } from '@/networks'
import { useGardenState } from '@/providers/GardenState'
import { useGardens } from '@/providers/Gardens'

function AppsAddresses() {
  const { address, chainId } = useConnectedGarden()
  const { loading: loadingGardens } = useGardens()
  const { config, installedApps, loading } = useGardenState()
  const { layoutName } = useLayout()

  const shortAddresses = layoutName === 'small'
  const { explorer, type } = getNetwork(chainId)

  if (loading) {
    return null
  }
  return (
    <div>
      <React.Fragment>
        <Box heading="Garden address">
          {loadingGardens ? (
            <div
              css={`
                display: flex;
                width: 100%;
                justify-content: center;
              `}
            >
              <LoadingRing />
            </div>
          ) : (
            <>
              <IdentityBadge
                entity={address}
                shorten={shortAddresses}
                explorerProvider={explorer}
                networkType={type}
              />

              <Info
                css={`
                  margin-top: ${2 * GU}px;
                  width: fit-content;
                `}
                mode="warning"
              >
                Do not send ETH or ERC20 tokens to this address.
              </Info>
            </>
          )}
        </Box>
        <Box heading="Apps">
          {loading ? (
            <div
              css={`
                display: flex;
                width: 100%;
                justify-content: center;
              `}
            >
              <LoadingRing />
            </div>
          ) : (
            <div
              css={`
                display: grid;
                grid-gap: ${3 * GU}px;
                grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
                text-align: center;
              `}
            >
              {config?.conviction.fundsManager && (
                <AppField
                  address={config.conviction.fundsManager}
                  chainId={chainId}
                  name="Funds Manager"
                />
              )}
              {installedApps.map((app, index) => {
                if (app.appId) {
                  return (
                    <AppField
                      key={index}
                      address={app.address}
                      chainId={chainId}
                      name={
                        app?.name || KNOWN_SYSTEM_APPS.get(app.appId).humanName
                      }
                    />
                  )
                }
              })}
            </div>
          )}
        </Box>
      </React.Fragment>
    </div>
  )
}

function AppField({ address, chainId, name }) {
  const { layoutName } = useLayout()
  const { explorer, type } = getNetwork(chainId)
  const shortAddresses = layoutName === 'small'

  return (
    <div
      css={`
        display: flex;
      `}
    >
      <Field label={SHORTENED_APPS_NAMES.get(name) || name}>
        <IdentityBadge
          entity={address}
          shorten={shortAddresses}
          explorerProvider={explorer}
          networkType={type}
        />
      </Field>
    </div>
  )
}

export default AppsAddresses
