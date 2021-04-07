import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  RADIUS,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import IdentityBadge from '../IdentityBadge'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { getNetworkName } from '../../utils/web3-utils'
import { getProviderFromUseWalletId } from '../../ethereum-providers'

import profileButtonSvg from '../../assets/profileButton.svg'
import stakeButtonSvg from '../../assets/stakeButton.svg'

function AccountScreenConnected({ onClosePopover, wallet }) {
  const theme = useTheme()
  const history = useHistory()
  const copy = useCopyToClipboard()

  const networkName = getNetworkName()
  const providerInfo = getProviderFromUseWalletId(wallet.activated)

  const goToProfile = useCallback(() => {
    history.push('/profile')
    onClosePopover()
  }, [history, onClosePopover])

  const goToStakeManagement = useCallback(() => {
    history.push('/collateral')
    onClosePopover()
  }, [history, onClosePopover])

  const handleCopyAddress = useCallback(() => copy(wallet.account), [
    copy,
    wallet,
  ])

  const handleDeactivate = useCallback(() => wallet.deactivate(), [wallet])

  return (
    <div
      css={`
        padding: ${2 * GU}px;
      `}
    >
      <ButtonBase
        onClick={goToProfile}
        external={false}
        css={`
          width: 100%;
        `}
      >
        <div
          css={`
            color: ${theme.contentSecondary};
            padding-bottom: ${2 * GU}px;
            border-bottom: 1px solid ${theme.border};
            display: flex;
            align-items: center;
            column-gap: ${1 * GU}px;
          `}
        >
          <img src={profileButtonSvg} alt="" width="24" height="24" />
          <span>My profile</span>
        </div>
      </ButtonBase>
      <ButtonBase
        onClick={goToStakeManagement}
        external={false}
        css={`
          width: 100%;
        `}
      >
        <div
          css={`
            color: ${theme.contentSecondary};
            padding-top: ${2 * GU}px;
            padding-bottom: ${2 * GU}px;
            border-bottom: 1px solid ${theme.border};
            display: flex;
            align-items: center;
            column-gap: ${1 * GU}px;
          `}
        >
          <img src={stakeButtonSvg} alt="" width="24" height="24" />
          <span>Collateral Manager</span>
        </div>
      </ButtonBase>
      <div
        css={`
          padding-top: ${2 * GU}px;
        `}
      >
        <h4
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Active Wallet
        </h4>
        <div
          css={`
            display: flex;
            align-items: center;
            width: 100%;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              margin-right: ${3 * GU}px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
                transform: translateY(-2px);
              `}
            />
            <span>
              {providerInfo.id === 'unknown' ? 'Wallet' : providerInfo.name}
            </span>
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
            `}
          >
            <ButtonBase
              onClick={handleCopyAddress}
              focusRingRadius={RADIUS}
              css={`
                display: flex;
                align-items: center;
                justify-self: flex-end;
                padding: ${0.5 * GU}px;
                &:active {
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IdentityBadge
                entity={wallet.account}
                compact
                badgeOnly
                css="cursor: pointer"
              />
              <IconCopy
                css={`
                  color: ${theme.hint};
                `}
              />
            </ButtonBase>
          </div>
        </div>
        <div
          css={`
            padding: ${2 * GU}px 0;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              color: ${theme.positive};
              ${textStyle('label2')};
            `}
          >
            <IconCheck size="small" />
            <span
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              {`Connected to ${networkName} Network`}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDeactivate}
        wide
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Disconnect wallet
      </Button>
    </div>
  )
}

export default AccountScreenConnected
