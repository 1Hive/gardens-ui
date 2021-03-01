import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, GU, Info, Link, textStyle, useTheme } from '@1hive/1hive-ui'
import ModalButton from '../ModalButton'
import InfoField from '../../../components/InfoField'
import { dateFormat } from '../../../utils/date-utils'
import { getDisputableAppByName } from '../../../utils/app-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

import iconError from '../../../assets/iconError.svg'
import iconCheck from '../../../assets/iconCheck.svg'

function CreateProposalRequirements({ agreement, availableStaked }) {
  const { disputableAppsWithRequirements, signedLatest } = agreement
  const { next } = useMultiModal()

  const convictionAppRequirements = getDisputableAppByName(
    disputableAppsWithRequirements,
    'Conviction Voting'
  )
  const { token, actionAmount } = convictionAppRequirements
  const enoughCollateral = availableStaked.gte(actionAmount)

  const error = useMemo(() => {
    return !signedLatest || !enoughCollateral
  }, [enoughCollateral, signedLatest])

  const handleOnContinue = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <InfoField label="Agreement signature and version">
        You must sign the{' '}
        <Link href="#/agreement" external={false}>
          community covenant
        </Link>{' '}
        in order to create a post. The Covenant was last updated at{' '}
        {dateFormat(agreement.effectiveFrom)}
      </InfoField>
      <AgreementStatus agreement={agreement} />
      <InfoField
        label="Action collateral"
        css={`
          margin-top: ${5 * GU}px;
        `}
      >
        You must stake {formatTokenAmount(actionAmount, token.decimals)} HNY as
        the collateral required to perform this action. Your current staked
        balance is {formatTokenAmount(availableStaked, token.decimals)}{' '}
        {token.symbol}.
      </InfoField>
      <CollateralStatus
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
  const { signedLatest, singedPreviousVersion } = agreement

  const goToAgreement = useCallback(() => {
    history.push('/agreement')
  }, [history])

  const infoData = useMemo(() => {
    if (!signedLatest && !singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the agreement.',
        actionButton: 'Sign Agreement',
        buttonOnClick: goToAgreement,
      }
    }
    if (singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the newest agreement.',
        actionButton: 'Sign Agreement',
        buttonOnClick: goToAgreement,
      }
    }
    if (signedLatest) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: 'You signed this organization’s Agreement on 2020/05/20.',
      }
    }
  }, [signedLatest, singedPreviousVersion, theme, goToAgreement])

  return <InfoBox data={infoData} />
}

function CollateralStatus({ availableStaked, actionAmount, token }) {
  const theme = useTheme()
  const history = useHistory()

  const goToStakeManager = useCallback(() => {
    history.push('/stake')
  }, [history])

  const infoData = useMemo(() => {
    if (availableStaked.gte(actionAmount)) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: `Your enabled account has sufficient balance to lock ${formatTokenAmount(
          actionAmount,
          token.decimals
        )} ${token.symbol} as the action collateral.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface,
      color: theme.negative,
      icon: iconError,
      text: `Your enabled account does not have sufficient balance to lock ${formatTokenAmount(
        actionAmount,
        token.decimals
      )} ${token.symbol} as the action collateral.`,
      actionButton: 'Stake collateral',
      buttonOnClick: goToStakeManager,
    }
  }, [availableStaked, actionAmount, token, goToStakeManager, theme])

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

export default CreateProposalRequirements
