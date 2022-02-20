import React, { useCallback } from 'react'
import {
  Button,
  IconConnect,
  IconCanvas,
  useTheme,
  DropDown,
} from '@1hive/1hive-ui'
import { SUPPORTED_CHAINS } from '@/networks'

import AccountConnectedButton from './ConnectedButton'
import { useWallet } from '@/providers/Wallet'
import { getNetworkName } from '@/utils/web3-utils'
import styled from 'styled-components'

type HeaderButtonProps = {
  screenId: string
  toggle: () => void
  compact: any
  isSupportedNetwork: boolean
}

const ProviderDropdown = styled(DropDown)`
  padding-left: 12px;

  > svg {
    color: #000;
  }
`

const HeaderButtons = ({
  screenId,
  toggle,
  compact,
  isSupportedNetwork,
}: HeaderButtonProps) => {
  const theme = useTheme()
  const { preferredNetwork, onPreferredNetworkChange, onNetworkSwitch } =
    useWallet()

  const supportedChains = SUPPORTED_CHAINS.map((chain) => getNetworkName(chain))
  const selectedIndex = SUPPORTED_CHAINS.indexOf(preferredNetwork)

  const handleNetworkChange = useCallback(
    (index) => {
      onPreferredNetworkChange(SUPPORTED_CHAINS[index])
      onNetworkSwitch(SUPPORTED_CHAINS[index])
    },
    [onPreferredNetworkChange]
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {screenId === 'connected' ? (
        <AccountConnectedButton onClick={toggle} />
      ) : isSupportedNetwork === false ? (
        <Button
          onClick={toggle}
          icon={
            <IconCanvas
              css={`
                color: #fff;
              `}
            />
          }
          label="Wrong Network"
          css={`
            background-color: rgb(255, 104, 113);
            border: 1px solid rgb(255, 104, 113);
            color: #fff;
          `}
        />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
        />
      )}

      <ProviderDropdown
        items={supportedChains}
        onChange={handleNetworkChange}
        selected={selectedIndex}
        wide
        style={{
          background: theme.accent,
        }}
      />
    </div>
  )
}

export default HeaderButtons
