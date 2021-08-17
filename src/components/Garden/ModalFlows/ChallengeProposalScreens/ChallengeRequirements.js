import React, { useCallback, useMemo } from 'react'
import {
  Button,
  GU,
  Info,
  LoadingRing,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import { useTokenBalanceOf, useTokenData } from '@hooks/useToken'
import { useWallet } from '@providers/Wallet'

import env from '@/environment'
import { formatTokenAmount } from '@utils/token-utils'
import { getDisputableAppByName } from '@utils/app-utils'

import iconError from '@assets/iconError.svg'
import iconCheck from '@assets/iconCheck.svg'

function ChallengeRequirements({
  agreement,
  collateralTokenAccountBalance,
  disputeFees,
}) {
  const { account } = useWallet()
  const { next } = useMultiModal()
  const { disputableAppsWithRequirements } = agreement

  const convictionAppRequirements = getDisputableAppByName(
    disputableAppsWithRequirements,
    env('CONVICTION_APP_NAME')
  )
  const { challengeAmount, token } = convictionAppRequirements

  // Dispute fee token data
  const [feeToken, loadingFeeToken] = useTokenData(disputeFees.token)
  const feeTokenAccountBalance = useTokenBalanceOf(disputeFees.token, account)

  const error = useMemo(() => {
    return (
      !collateralTokenAccountBalance.gte(challengeAmount) ||
      !feeTokenAccountBalance.gte(disputeFees.amount)
    )
  }, [
    challengeAmount,
    collateralTokenAccountBalance,
    disputeFees,
    feeTokenAccountBalance,
  ])

  const handleOnContinue = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <InfoField label="Challenge deposit">
        You must deposit {formatTokenAmount(challengeAmount, token.decimals)}{' '}
        {token.symbol} in order to challenge a proposal.
      </InfoField>
      <CollateralStatus
        accountBalance={collateralTokenAccountBalance}
        challengeAmount={challengeAmount}
        token={token}
      />
      <InfoField
        label="Dispute fees"
        css={`
          margin-top: ${5 * GU}px;
        `}
      >
        {loadingFeeToken ? (
          <LoadingRing />
        ) : (
          <span>
            You must deposit{' '}
            {formatTokenAmount(disputeFees.amount, feeToken.decimals)}{' '}
            {feeToken.symbol} as the dispute fees.
          </span>
        )}
      </InfoField>
      {!loadingFeeToken && (
        <FeesStatus
          accountBalance={feeTokenAccountBalance}
          feesAmount={disputeFees.amount}
          token={feeToken}
        />
      )}
      <ModalButton
        mode="strong"
        loading={false}
        onClick={handleOnContinue}
        disabled={error}
      >
        Continue
      </ModalButton>
      <Info
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        The challenge deposit and dispute fees will be returned to your account
        should the submitter accept your settlement offer, or if you win the
        dispute raised to Celeste. Your wallet balance is{' '}
        {formatTokenAmount(collateralTokenAccountBalance, token.decimals)}{' '}
        {token.symbol}.
      </Info>
    </div>
  )
}

function CollateralStatus({ accountBalance, challengeAmount, token }) {
  const theme = useTheme()

  const infoData = useMemo(() => {
    if (accountBalance.gte(challengeAmount)) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: `Your enabled account has sufficient balance to lock ${formatTokenAmount(
          challengeAmount,
          token.decimals
        )} ${token.symbol} as the challenge deposit.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface,
      color: theme.negative,
      icon: iconError,
      text: `Your enabled account does not have sufficient balance to lock ${formatTokenAmount(
        challengeAmount,
        token.decimals
      )} ${token.symbol} as the challenge deposit.`,
    }
  }, [accountBalance, challengeAmount, token, theme])

  return <InfoBox data={infoData} />
}

function FeesStatus({ accountBalance, feesAmount, token }) {
  const theme = useTheme()

  const infoData = useMemo(() => {
    if (accountBalance.gte(feesAmount)) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: `Your enabled account has sufficient balance to lock ${formatTokenAmount(
          feesAmount,
          token.decimals
        )} ${token.symbol} as the dispute fees.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface,
      color: theme.negative,
      icon: iconError,
      text: `Your enabled account does not have sufficient balance to lock ${formatTokenAmount(
        feesAmount,
        token.decimals
      )} ${token.symbol} as the dispute fees.`,
    }
  }, [accountBalance, feesAmount, token, theme])

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

export default ChallengeRequirements
