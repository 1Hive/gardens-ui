import React, { useCallback, useMemo } from 'react'
import { Button, GU, Info, textStyle, useTheme } from '@1hive/1hive-ui'
import InfoField from '../../../components/InfoField'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

import BigNumber from '../../../lib/bigNumber'
import env from '../../../environment'
import { formatTokenAmount } from '../../../utils/token-utils'
import { getDisputableAppByName } from '../../../utils/app-utils'

import iconError from '../../../assets/iconError.svg'
import iconCheck from '../../../assets/iconCheck.svg'

function ChallengeProposalRequirements({
  agreement,
  accountBalance,
  disputeFees,
}) {
  const { next } = useMultiModal()
  const { disputableAppsWithRequirements } = agreement

  const convictionAppRequirements = getDisputableAppByName(
    disputableAppsWithRequirements,
    env('CONVICTION_APP_NAME')
  )
  const { challengeAmount, token } = convictionAppRequirements

  const disputeFeesBN = new BigNumber(disputeFees.amount.toString())

  const enoughChallengeCollateral = accountBalance.gte(challengeAmount)

  const error = useMemo(() => {
    return !enoughChallengeCollateral
  }, [enoughChallengeCollateral])

  const handleOnContinue = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <InfoField label="Action collateral">
        You must stake {formatTokenAmount(challengeAmount, token.decimals)}{' '}
        {token.symbol} as the collateral required to challenge this action.
      </InfoField>
      <CollateralStatus
        accountBalance={accountBalance}
        challengeAmount={challengeAmount}
        token={token}
      />
      <InfoField
        label="Dispute fees"
        css={`
          margin-top: ${5 * GU}px;
        `}
      >
        You must deposit {formatTokenAmount(disputeFeesBN, 18)} {token.symbol}{' '}
        as the dispute fees.
      </InfoField>
      <FeesStatus
        accountBalance={accountBalance}
        feesAmount={disputeFeesBN}
        token={token}
      />
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
        The action collateral and dispute fees will be returned to your account
        if the submitter accepts your settlement offer or if you win the dispute
        raised to Celeste. Your wallet balance is{' '}
        {formatTokenAmount(accountBalance, token.decimals)} {token.symbol}.
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
        )} ${token.symbol} as the challenge collateral.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface,
      color: theme.negative,
      icon: iconError,
      text: `Your enabled account does not have sufficient balance to lock ${formatTokenAmount(
        challengeAmount,
        token.decimals
      )} ${token.symbol} as the challenge collateral.`,
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

export default ChallengeProposalRequirements
