import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, GU, Info, Link, textStyle, useTheme } from '@1hive/1hive-ui'
import ModalButton from '../ModalButton'
import InfoField from '../../../components/InfoField'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

import { dateFormat } from '../../../utils/date-utils'
import env from '../../../environment'
import { formatTokenAmount } from '../../../utils/token-utils'
import { getDisputableAppByName } from '../../../utils/app-utils'

import iconError from '../../../assets/iconError.svg'
import iconCheck from '../../../assets/iconCheck.svg'

function CreateProposalRequirements({ agreement, staking }) {
  const { disputableAppsWithRequirements, signedLatest } = agreement
  const { next } = useMultiModal()
  const { available: availableStaked, allowance } = staking || {}

  const convictionAppRequirements = getDisputableAppByName(
    disputableAppsWithRequirements,
    env('CONVICTION_APP_NAME')
  )
  const { token, actionAmount } = convictionAppRequirements
  const enoughCollateral = availableStaked.gte(actionAmount)
  const enoughAllowance = allowance.gt(0)

  const error = useMemo(() => {
    return !signedLatest || !enoughCollateral || !enoughAllowance
  }, [enoughAllowance, enoughCollateral, signedLatest])

  const handleOnContinue = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <InfoField label="Covenant signature and version">
        You must sign the{' '}
        <Link href="#/covenant" external={false}>
          Community Covenant
        </Link>{' '}
        in order to create a proposal. The Covenant was last updated on{' '}
        {dateFormat(agreement.effectiveFrom)}
      </InfoField>
      <AgreementStatus agreement={agreement} />
      <InfoField
        label="Action collateral"
        css={`
          margin-top: ${5 * GU}px;
        `}
      >
        You must lock {formatTokenAmount(actionAmount, token.decimals)}{' '}
        {token.symbol} as the collateral required to create a proposal. You can
        manage your balance in the{' '}
        <Link href="#/collateral" external={false}>
          Collateral Manager
        </Link>
      </InfoField>
      <CollateralStatus
        allowance={allowance}
        availableStaked={availableStaked}
        actionAmount={actionAmount}
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
    </div>
  )
}

function AgreementStatus({ agreement }) {
  const history = useHistory()
  const theme = useTheme()
  const { signedLatest, singedPreviousVersion, lastSignatureDate } = agreement

  const goToAgreement = useCallback(() => {
    history.push('/covenant')
  }, [history])

  const infoData = useMemo(() => {
    if (!signedLatest && !singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the newest covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (signedLatest) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: `You signed this organization’s Covenant on ${dateFormat(
          lastSignatureDate
        )}.`,
      }
    }
  }, [
    lastSignatureDate,
    signedLatest,
    singedPreviousVersion,
    theme,
    goToAgreement,
  ])

  return <InfoBox data={infoData} />
}

function CollateralStatus({ allowance, availableStaked, actionAmount, token }) {
  const theme = useTheme()
  const history = useHistory()

  const goToStakeManager = useCallback(() => {
    history.push('/collateral')
  }, [history])

  const infoData = useMemo(() => {
    if (!availableStaked.gte(actionAmount)) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: `Your enabled account does not have sufficient balance to lock ${formatTokenAmount(
          actionAmount,
          token.decimals
        )} ${token.symbol} as the action collateral.`,
        actionButton: 'Deposit collateral',
        buttonOnClick: goToStakeManager,
      }
    }

    if (!allowance.gt(0)) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: `You need to allow the Covenant as the lock manager of your staked HNY`,
        actionButton: 'Collateral manager',
        buttonOnClick: goToStakeManager,
      }
    }

    return {
      backgroundColor: '#EBFBF6',
      color: theme.positive,
      icon: iconCheck,
      text: `Your enabled account has sufficient balance to lock ${formatTokenAmount(
        actionAmount,
        token.decimals
      )} ${token.symbol} as the action collateral.`,
    }
  }, [allowance, availableStaked, actionAmount, token, goToStakeManager, theme])

  return <InfoBox data={infoData} />
}

function InfoBox({ data }) {
  return (
    <Info
      background={data.backgroundColor}
      borderColor="none"
      color={data.color.toString()}
      css={`
        border-radius: ${0.5 * GU}px;
        margin-top: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          ${textStyle('body2')};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
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
        </div>
        {data.actionButton && (
          <div
            css={`
              margin-left: ${1 * GU}px;
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

export default CreateProposalRequirements
