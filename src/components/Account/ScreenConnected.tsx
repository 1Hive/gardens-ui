import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { getProviderFromUseWalletId } from 'use-wallet'
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
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useCopyToClipboard } from '@hooks/useCopyToClipboard'
import { useWallet } from '@providers/Wallet'
import { useAppTheme } from '@/providers/AppTheme'

import { buildGardenPath } from '@utils/routing-utils'
import { getNetworkName } from '@utils/web3-utils'

import profileButtonSvg from '@images/icons/base/profileButton.svg'
// import stakeButtonSvg from '@images/icons/base/stakeButton.svg'
// import profileButtonDarkSvg from '@images/icons/dark-mode/profileButton.svg'
// import stakeButtonDarkSvg from '@images/icons/dark-mode/stakeButton.svg'

type AccountScreenConnectedProps = {
  providerId: string
  onClosePopover: () => void
}

function AccountScreenConnected({
  providerId,
  onClosePopover,
}: AccountScreenConnectedProps) {
  const theme = useTheme()
  const { appearance } = useAppTheme()
  const router = useRouter()
  const copy = useCopyToClipboard()
  const connectedGarden = useConnectedGarden()
  const { account, chainId, resetConnection } = useWallet()

  const networkName = getNetworkName(chainId)
  const providerInfo = getProviderFromUseWalletId(providerId)

  const goToProfile = useCallback(() => {
    router.push(`/profile`)
    onClosePopover()
  }, [router, onClosePopover])

  const goToStakeManagement = useCallback(() => {
    const path = buildGardenPath(router, 'collateral')
    router.push(path)
    onClosePopover()
  }, [router, onClosePopover])

  const handleCopyAddress = useCallback(() => copy(account), [account, copy])

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
          <img
            src={
              appearance === 'light' ? profileButtonSvg : profileButtonDarkSvg
            }
            alt=""
            width="24"
            height="24"
          />
          <span>My profile</span>
        </div>
      </ButtonBase>
      {connectedGarden && (
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
            <img
              src={appearance === 'light' ? stakeButtonSvg : stakeButtonDarkSvg}
              alt=""
              width="24"
              height="24"
            />
            <span>Deposit Manager</span>
          </div>
        </ButtonBase>
      )}
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
              src={providerInfo?.image}
              alt=""
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
                transform: translateY(-2px);
              `}
            />
            <span>
              {providerInfo?.id === 'unknown' ? 'Wallet' : providerInfo?.name}
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
                entity={account}
                compact
                badgeOnly
                css="cursor: pointer"
              />
              <IconCopy color={theme.hint} />
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
        onClick={resetConnection}
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
