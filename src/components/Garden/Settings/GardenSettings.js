import React, { useEffect, useState } from 'react'
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
// import ConvictionVotingSettings from './ConvictionVotingSettings'
// import MultiModal from '@/components/MultiModal/MultiModal'
// import {
//   calculateDecay,
//   calculateWeight,
// } from '@/utils/conviction-modelling-helpers'
import useActions from '@/hooks/useActions'
// import SetConvictionSettingsScreens from '../ModalFlows/DecisionVoteScreens/SetConvictionSettingsScreens'

function GardenSettings() {
  const theme = useTheme()
  const { layoutName } = useLayout()
  // const [modalVisible, setModalVisible] = useState(false)
  const [settings, setSettings] = useState({})
  // const [params, setParams] = useState({})

  const { connectedGarden } = useGardens()
  const { installedApps, loading, config } = useGardenState()

  // const [loadingSettings, setLoadingSettings] = useState(true)

  const { convictionActions } = useActions()

  const { explorer, type } = getNetwork()

  const shortAddresses = layoutName === 'small'

  // const initialSettings = {
  //   decay: calculateDecay(2),
  //   halflifeDays: 2,
  //   maxRatio: 10,
  //   minThreshold: 2,
  //   minThresholdStakePct: 5,
  //   requestToken: '0x5b0f8d8f47e3fdf7ee1c337abca19dbba98524e6',
  //   weight: calculateWeight(2, 10),
  // }

  // const handleUpdateParameters = useCallback(params => {
  //   setParams(params)
  //   setModalVisible(true)
  // }, [])

  useEffect(() => {
    async function getSettingsData() {
      const settings = await convictionActions.getConvictionSettings()
      setSettings(settings)
      // setLoadingSettings(false)
    }

    getSettingsData()
  }, [convictionActions])

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
      {/* <MultiModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <SetConvictionSettingsScreens params={params} />
      </MultiModal> */}
    </div>
  )
}

export default GardenSettings
