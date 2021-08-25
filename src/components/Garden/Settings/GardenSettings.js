import React from 'react'
import {
  Box,
  Button,
  GU,
  Header,
  IdentityBadge,
  Info,
  TextInput,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import { useGardenState } from '@/providers/GardenState'
import { useGardens } from '@/providers/Gardens'

function GardenSettings() {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { connectedGarden } = useGardens()
  const { installedApps, loading } = useGardenState()

  const shortAddresses = layoutName === 'small'

  return (
    <React.Fragment>
      <Header primary="Garden Settings" />
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
      {loading ? (
        <Box heading="Installed Aragon apps">
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
        </Box>
      ) : (
        <React.Fragment>
          <Box heading="Installed Aragon apps">
            <ul
              css={`
                list-style: none;
                display: grid;
                grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
                grid-column-gap: ${2 * GU}px;
                margin-bottom: -${3 * GU}px;
              `}
            >
              {installedApps.map(({ name, address }) => (
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
                    <IdentityBadge entity={address} shorten={shortAddresses} />
                  </div>
                </li>
              ))}
            </ul>
          </Box>
        </React.Fragment>
      )}
      <Box heading="EVMcrispr Executor">
        <React.Fragment
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${22 * GU}px;
            ${textStyle('body2')}
          `}
        />
        <>
          <TextInput placeholder="Add EVMcrispr input" />
          <Button
            mode="strong"
            onClick={() => history.push('/home')}
            css={`
              margin-left: ${2 * GU}px;
              margin-bottom: ${3 * GU}px;
            `}
          >
            Execute
          </Button>
          <Info
            css={`
              width: fit-content;
            `}
          >
            If you have the required permissions executing the script will
            create a decision vote in the Garden.
          </Info>
        </>
      </Box>
    </React.Fragment>
  )
}

export default GardenSettings
