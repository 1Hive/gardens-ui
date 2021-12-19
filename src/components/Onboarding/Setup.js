import React from 'react'

import { GU, IconCross, Tag, useTheme } from '@1hive/1hive-ui'

import { getNetworkName } from '@utils/web3-utils'

import { useWallet } from '@providers/Wallet'

import gardensLogo from '@assets/gardensLogoMark.svg'

import SavedProgress from './SavedProgress'
import Screens from './Screens'
import StepsPanel from './Steps/StepsPanel'

function Setup({ onClose }) {
  const theme = useTheme()
  const { chainId } = useWallet()

  return (
    <>
      <div
        css={`
          width: ${41 * GU}px;
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        <img
          css={`
            display: flex;
            padding-left: ${2.25 * GU}px;
            margin-top: ${2 * GU}px;
          `}
          src={gardensLogo}
          height={32}
          alt=""
        />
        <StepsPanel />
      </div>
      <div
        css={`
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
          background: #f9f9f8;
        `}
      >
        <div
          css={`
            padding: ${3 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div>
            <Tag mode="new">Connected to {getNetworkName(chainId)}</Tag>
          </div>
          <div
            css={`
              cursor: pointer;
            `}
            onClick={onClose}
          >
            <IconCross color={theme.surfaceIcon} />
          </div>
        </div>
        <div
          css={`
            overflow-y: auto;
            height: calc(100vh - 127px);
            position: relative;
          `}
        >
          <section
            css={`
              margin: 0px auto;
              max-width: 950px;
              padding: 0px 24px 48px;
            `}
          >
            <div
              css={`
                display: flex;
                flex-direction: column;
              `}
            >
              <Screens />
            </div>
          </section>
          <SavedProgress />
        </div>
      </div>
    </>
  )
}

export default Setup
