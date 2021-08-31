import React from 'react'
import {
  Accordion,
  Box,
  GU,
  Header,
  IdentityBadge,
  Info,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import { useGardenState } from '@/providers/GardenState'
import { useGardens } from '@/providers/Gardens'
import { getNetwork } from '@/networks'
import ConvictionVotingSettings from './ConvictionVotingSettings'
import {
  calculateDecay,
  calculateWeight,
} from '@/utils/conviction-modelling-helpers'

function GardenSettings() {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { connectedGarden } = useGardens()
  const { installedApps, loading, config } = useGardenState()

  const { explorer, type } = getNetwork()

  const shortAddresses = layoutName === 'small'

  const initialSettings = {
    decay: calculateDecay(2),
    halflifeDays: 2,
    maxRatio: 10,
    minThreshold: 2,
    minThresholdStakePct: 5,
    weight: calculateWeight(2, 10),
  }

  return (
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
      <Box heading="Conviction Voting parameters">
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <ConvictionVotingSettings initialSettings={initialSettings} />
        </div>
      </Box>
      <Accordion
        items={[
          [
            <div
              css={`
                ${textStyle('body2')}
              `}
            >
              Installed Apps
            </div>,
            loading ? (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: ${22 * GU}px;
                  ${textStyle('body2')}
                `}
              >
                Loading apps…
              </div>
            ) : (
              <ul
                css={`
                  list-style: none;
                  display: grid;
                  grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
                  grid-column-gap: ${2 * GU}px;
                `}
              >
                {installedApps
                  .filter(({ name }) => Boolean(name))
                  .map(({ name, address }) => (
                    <li
                      key={address}
                      css={`
                        margin-bottom: ${3 * GU}px;
                      `}
                    >
                      <label
                        css={`
                          color: ${theme.surfaceContentSecondary};
                          ${unselectable()};
                          ${textStyle('label2')};
                        `}
                      >
                        {name}
                      </label>
                      <div
                        css={`
                          margin-top: ${1 * GU}px;
                        `}
                      >
                        <IdentityBadge
                          entity={address}
                          shorten={shortAddresses}
                          explorerProvider={explorer}
                          networkType={type}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            ),
          ],
        ]}
      />
    </React.Fragment>
  )
}

export default GardenSettings
