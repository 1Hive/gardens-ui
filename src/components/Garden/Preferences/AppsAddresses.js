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
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@/providers/GardenState'
import { useGardens } from '@/providers/Gardens'
import { getNetwork } from '@/networks'

import { KNOWN_SYSTEM_APPS, SHORTENED_APPS_NAMES } from '@utils/app-utils'

function AppsAddresses() {
  const { layoutName } = useLayout()

  const { loading } = useGardens()
  const connectedGarden = useConnectedGarden()

  const gardenState = useGardenState()

  const { explorer, type } = getNetwork()

  const shortAddresses = layoutName === 'small'

  if (!gardenState || !connectedGarden) {
    return null
  }
  return (
    <div>
      <React.Fragment>
        <Box heading="Garden address">
          {!connectedGarden || loading ? (
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
                entity={connectedGarden.address}
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
          {!gardenState || gardenState.loading ? (
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
              {gardenState.config?.conviction.fundsManager && (
                <AppField
                  name="Funds Manager"
                  address={gardenState.config.conviction.fundsManager}
                />
              )}
              {gardenState.installedApps.map((app, index) => {
                if (app.appId) {
                  return (
                    <AppField
                      name={
                        app?.name || KNOWN_SYSTEM_APPS.get(app.appId).humanName
                      }
                      address={app.address}
                      key={index}
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

function AppField({ name, address, index }) {
  const { layoutName } = useLayout()
  const { explorer, type } = getNetwork()
  const shortAddresses = layoutName === 'small'

  return (
    <div
      key={index}
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
