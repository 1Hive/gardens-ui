import React, { useCallback, useMemo } from 'react'
import {
  Button,
  GU,
  Info,
  Link,
  LoadingRing,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import { useTokenBalanceOf, useTokenData } from '@hooks/useToken'
import { useWallet } from '@providers/Wallet'

import { formatTokenAmount } from '@utils/token-utils'

import { CELESTE_URL } from '@/endpoints'

function RaiseDisputeRequirements({
  celesteSynced,
  disputeFees,
  getTransactions,
}) {
  const { account } = useWallet()
  const { next } = useMultiModal()
  const { chainId } = useConnectedGarden()
  // Dispute fee token data
  const [feeToken, loadingFeeToken] = useTokenData(disputeFees.token, chainId)
  const accountBalance = useTokenBalanceOf(disputeFees.token, account, chainId)

  const handleOnCreateDispute = useCallback(() => {
    getTransactions(() => {
      next()
    })
  }, [next, getTransactions])

  const enoughDisputeFees = accountBalance.gte(disputeFees.amount)
  return (
    <div>
      <InfoField label="Dispute fees">
        {loadingFeeToken ? (
          <LoadingRing />
        ) : (
          <span>
            You must deposit{' '}
            {formatTokenAmount(disputeFees.amount, feeToken.decimals)}{' '}
            {feeToken.symbol} as the dispute fees. This balance will be returned
            to your account if Celeste outcome is to allow the action.
          </span>
        )}
      </InfoField>
      {!loadingFeeToken && (
        <FeesStatus
          accountBalance={accountBalance}
          feesAmount={disputeFees.amount}
          token={feeToken}
        />
      )}
      <div
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <InfoField label="Celeste status">
          Celeste&apos;s term must be up to date in order to dispute this
          action.
        </InfoField>
        <CelesteSyncedStatus synced={celesteSynced} />
      </div>
      <ModalButton
        mode="strong"
        loading={false}
        onClick={handleOnCreateDispute}
        disabled={!enoughDisputeFees || !celesteSynced}
      >
        Create dispute
      </ModalButton>
    </div>
  )
}

function FeesStatus({ accountBalance, feesAmount, token }) {
  const theme = useTheme()

  const infoData = useMemo(() => {
    if (accountBalance.gte(feesAmount)) {
      return {
        backgroundColor: theme.positiveContent.alpha(0.8),
        color: theme.positive.toString(),
        icon: '/icons/base/iconCheck.svg',
        text: `Your enabled account has sufficient balance to pay ${formatTokenAmount(
          feesAmount,
          token.decimals
        )} ${token.symbol} as the dispute fees.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface.toString(),
      color: theme.negative.toString(),
      icon: '/icons/base/iconError.svg',
      text: `Your enabled account does not have sufficient balance to pay ${formatTokenAmount(
        feesAmount,
        token.decimals
      )} ${token.symbol} as the dispute fees.`,
    }
  }, [accountBalance, feesAmount, theme, token])

  return <InfoBox data={infoData} />
}

function CelesteSyncedStatus({ synced }) {
  const theme = useTheme()

  const infoData = useMemo(() => {
    if (synced) {
      return {
        backgroundColor: theme.positiveContent.alpha(0.8),
        color: theme.positive.toString(),
        icon: '/icons/base/iconCheck.svg',
        text: `Celeste is Synced!`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface.toString(),
      color: theme.negative.toString(),
      icon: '/icons/base/iconError.svg',
      text: (
        <div>
          Celeste is not synced, head over to the{' '}
          <Link href={CELESTE_URL}>dashboard</Link> and update the term.
        </div>
      ),
    }
  }, [synced, theme])

  return <InfoBox data={infoData} />
}

function InfoBox({ data }) {
  return (
    <Info
      background={data.backgroundColor}
      borderColor="none"
      color={data.color}
      css={`
        border-radius: ${0.5 * GU}px;
        margin-top: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          ${textStyle('body2')};
        `}
      >
        <img src={data.icon} width="18" height="18" />
        <span
          css={`
            margin-left: ${1.5 * GU}px;
          `}
        >
          {data.text}
        </span>
        {data.actionButton && (
          <div
            css={`
              margin-left: auto;
            `}
          >
            <Button
              css={`
                border-radius: ${0.5 * GU}px;
              `}
              onClick={data.buttonOnClick}
            >
              {data.actionButton}
            </Button>
          </div>
        )}
      </div>
    </Info>
  )
}

export default RaiseDisputeRequirements
