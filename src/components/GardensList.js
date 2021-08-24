import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import {
  DropDown,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import Loader from '@components/Loader'
import { useGardens } from '@providers/Gardens'

import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import defaultTokenLogo from '@assets/defaultTokenLogo.png'
import { SUPPORTED_CHAINS } from '@/networks'
import { getNetworkName } from '@utils/web3-utils'
import { useWallet } from '@providers/Wallet'

function GardensList() {
  const { gardens, loading } = useGardens()
  const {
    handleOnPreferredNetworkChange,
    isSupportedNetwork,
    preferredNetwork,
  } = useWallet()
  const supportedChains = SUPPORTED_CHAINS.map(chain => getNetworkName(chain))

  const selectedIndex = SUPPORTED_CHAINS.indexOf(preferredNetwork)

  console.log('LOADING!!!!  ', loading)

  if (loading) {
    return <Loader />
  }

  return (
    <div
      css={`
        padding: ${3 * GU}px;
        display: flex;
        flex-direction: column;
        margin-bottom: ${10 * GU}px;
      `}
    >
      {!isSupportedNetwork && (
        <DropDown
          onChange={handleOnPreferredNetworkChange}
          selected={selectedIndex}
          items={supportedChains}
          css={`
            width: ${40 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        />
      )}

      <div
        css={`
          display: grid;
          grid-gap: ${2 * GU}px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        `}
      >
        {gardens.map(garden => (
          <GardenCard key={garden.id} garden={garden} />
        ))}
      </div>
    </div>
  )
}

function GardenCard({ garden }) {
  const theme = useTheme()
  const history = useHistory()
  const handleSelectGarden = useCallback(() => {
    history.push(`/garden/${garden.address}`)
  }, [garden, history])

  const token = garden.wrappableToken || garden.token

  return (
    <div
      onClick={handleSelectGarden}
      css={`
        padding: ${5 * GU}px ${4 * GU}px ${3 * GU}px ${4 * GU}px;
        background: ${theme.surface};
        border: 1px solid ${theme.border};
        border-radius: ${2.5 * GU}px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15);
        cursor: pointer;

        display: grid;
        grid-template-rows: 72px 32px 72px auto auto;
        grid-gap: ${2 * GU}px;
        text-align: center;
      `}
    >
      <div
        css={`
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <img src={garden.logo || defaultGardenLogo} alt="" height="72" />
      </div>
      <div
        css={`
          ${textStyle('title4')};
        `}
      >
        {garden.name || shortenAddress(garden.id)}
      </div>
      <div
        css={`
          color: ${theme.contentSecondary};
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        `}
      >
        {garden.description || 'No description'}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: ${1 * GU}px;
          ${textStyle('title4')};
          justify-content: center;
          color: ${theme.content};
        `}
      >
        <img
          src={token?.logo || defaultTokenLogo}
          alt=""
          height="20"
          width="20"
        />
        <span
          css={`
            margin-left: ${0.75 * GU}px;
          `}
        >
          {token?.symbol}
        </span>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: ${theme.contentSecondary};
        `}
      >
        <div>
          {garden.proposalCount} Proposal{garden.proposalCount === 1 ? '' : 's'}
        </div>
        <div>
          {garden.supporterCount} Member{garden.supporterCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  )
}

export default GardensList
