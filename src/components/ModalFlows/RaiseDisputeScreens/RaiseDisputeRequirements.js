import React, { useCallback, useMemo } from 'react'
import { Button, GU, Info, Link, textStyle, useTheme } from '@1hive/1hive-ui'
import InfoField from '../../../components/InfoField'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

import BigNumber from '../../../lib/bigNumber'
import { formatTokenAmount } from '../../../utils/token-utils'

import iconError from '../../../assets/iconError.svg'
import iconCheck from '../../../assets/iconCheck.svg'
import { getNetwork } from '../../../networks'

function RaiseDisputeRequirements({
  accountBalance,
  celesteSynced,
  disputeFees,
  getTransactions,
}) {
  const { next } = useMultiModal()

  const disputeFeesBN = new BigNumber(disputeFees.amount.toString())

  const enoughDisputeFees = accountBalance.gte(disputeFeesBN)

  const handleOnCreateDispute = useCallback(() => {
    getTransactions(() => {
      next()
    })
  }, [next, getTransactions])

  return (
    <div>
      <InfoField label="Dispute fees">
        You must deposit {formatTokenAmount(disputeFeesBN, 18)} HNY as the
        dispute fees. This balance will be returned to your account if Celeste
        outcome is to allow the action.
      </InfoField>
      <FeesStatus accountBalance={accountBalance} feesAmount={disputeFeesBN} />
      <div
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <InfoField label="Celeste status">
          Celeste's term must be up to date in order to dispute this action.
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

function FeesStatus({ accountBalance, feesAmount }) {
  const theme = useTheme()

  const infoData = useMemo(() => {
    if (accountBalance.gte(feesAmount)) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive.toString(),
        icon: iconCheck,
        text: `Your enabled account has sufficient balance to pay ${formatTokenAmount(
          feesAmount,
          18
        )} HNY as the dispute fees.`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface.toString(),
      color: theme.negative.toString(),
      icon: iconError,
      text: `Your enabled account does not have sufficient balance to pay ${formatTokenAmount(
        feesAmount,
        18
      )} HNY as the dispute fees.`,
    }
  }, [accountBalance, feesAmount, theme])

  return <InfoBox data={infoData} />
}

function CelesteSyncedStatus({ synced }) {
  const theme = useTheme()
  const celesteUrl = getNetwork().celesteUrl

  const infoData = useMemo(() => {
    if (synced) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive.toString(),
        icon: iconCheck,
        text: `Celeste is Synced!`,
      }
    }

    return {
      backgroundColor: theme.negativeSurface.toString(),
      color: theme.negative.toString(),
      icon: iconError,
      text: (
        <div>
          Celeste is not synced, head over to the{' '}
          <Link href={celesteUrl}>dashboard</Link> and update the term.
        </div>
      ),
    }
  }, [celesteUrl, synced, theme])

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
