import React, { useEffect, useState } from 'react'
import {
  Box,
  GU,
  Header,
  IdentityBadge,
  Info,
  useLayout,
} from '@1hive/1hive-ui'
import { useGardenState } from '@/providers/GardenState'
import { useGardens } from '@/providers/Gardens'
import { getNetwork } from '@/networks'

function AppsAddresses() {
  const { layoutName } = useLayout()

  const { connectedGarden } = useGardens()
  const { installedApps, loading, config } = useGardenState()

  const { explorer, type } = getNetwork()

  const shortAddresses = layoutName === 'small'

  return (
    <div>
      <React.Fragment>
        <Header primary="Garden Settings" />
        <Box heading="Common Pool address">
          {config?.conviction.vault && (
            <div
              css={`
                margin-top: ${2 * GU}px;
                margin-bottom: ${3 * GU}px;
              `}
            >
              <IdentityBadge
                entity={config?.conviction.vault}
                shorten={shortAddresses}
                explorerProvider={explorer}
                networkType={type}
              />
            </div>
          )}
        </Box>
        <Box heading="Garden address">
          {connectedGarden && (
            <>
              <div
                css={`
                  margin-top: ${2 * GU}px;
                  margin-bottom: ${3 * GU}px;
                `}
              >
                <IdentityBadge
                  entity={connectedGarden.address}
                  shorten={shortAddresses}
                  explorerProvider={explorer}
                  networkType={type}
                />
              </div>
              <Info
                css={`
                  width: fit-content;
                `}
                mode="warning"
              >
                Do not send ETH or ERC20 tokens to this address.
              </Info>
            </>
          )}
        </Box>
        <Box heading="Conviction Voting">
          {/* {loadingSettings && (
            <ConvictionVotingSettings
              onUpdateParameters={handleUpdateParameters}
              settings={initialSettings}
            />
          )} */}
        </Box>
        {settings && <div>Render</div>}
        <Box heading="Covenant">
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          />
        </Box>
      </React.Fragment>
      {/* <MultiModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <SetConvictionSettingsScreens params={params} />
      </MultiModal> */}
    </div>
  )
}

export default AppsAddresses
