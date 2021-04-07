import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  DropDown,
  Field,
  GU,
  Info,
  isAddress,
  Link,
  LoadingRing,
  MEDIUM_RADIUS,
  TextInput,
  useTheme,
} from '@1hive/1hive-ui'
import { useAppState } from '../../../providers/AppState'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import useRequestAmount from '../../../hooks/useRequestAmount'

import BigNumber from '../../../lib/bigNumber'
import { toDecimals } from '../../../utils/math-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import { calculateThreshold, getMaxConviction } from '../../../lib/conviction'

const FORUM_POST_REGEX = /https:\/\/forum.1hive.org\/t\/.*?\/([0-9]+)/

const SIGNALING_PROPOSAL = 0
const FUNDING_PROPOSAL = 1

const DEFAULT_FORM_DATA = {
  title: '',
  link: '',
  proposalType: SIGNALING_PROPOSAL,
  amount: {
    stable: false,
    value: '0',
    valueBN: new BigNumber(0),
  },
  beneficiary: '',
}

const PROPOSAL_TYPES = ['Suggestion', 'Funding']

const AddProposalPanel = React.memo(({ setProposalData }) => {
  const { next } = useMultiModal()
  const {
    config,
    requestToken,
    stableToken,
    stakeToken,
    effectiveSupply,
    vaultBalance,
  } = useAppState()
  const { alpha, maxRatio, weight } = config.conviction

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const fundingMode = formData.proposalType === FUNDING_PROPOSAL

  const handleAmountEditMode = useCallback(
    editMode => {
      setFormData(formData => {
        const { amount } = formData

        const newValue = amount.valueBN.gte(0)
          ? formatTokenAmount(
              amount.valueBN,
              stakeToken.decimals,
              false,
              false,
              {
                commas: !editMode,
                replaceZeroBy: editMode ? '' : '0',
                rounding: stakeToken.decimals,
              }
            )
          : ''

        return {
          ...formData,
          amount: {
            ...amount,
            value: newValue,
          },
        }
      })
    },
    [stakeToken]
  )

  const handleIsStableChange = useCallback(checked => {
    setFormData(formData => ({
      ...formData,
      amount: { ...formData.amount, stable: checked },
    }))
  }, [])

  const handleTitleChange = useCallback(event => {
    const updatedTitle = event.target.value
    setFormData(formData => ({ ...formData, title: updatedTitle }))
  }, [])

  const handleAmountChange = useCallback(
    event => {
      const updatedAmount = event.target.value

      const newAmountBN = new BigNumber(
        isNaN(updatedAmount)
          ? -1
          : toDecimals(updatedAmount, stakeToken.decimals)
      )

      setFormData(formData => ({
        ...formData,
        amount: {
          ...formData.amount,
          value: updatedAmount,
          valueBN: newAmountBN,
        },
      }))
    },
    [stakeToken.decimals]
  )

  const handleProposalTypeChange = useCallback(selected => {
    setFormData(formData => ({
      ...formData,
      proposalType: selected,
    }))
  }, [])

  const handleBeneficiaryChange = useCallback(event => {
    const updatedBeneficiary = event.target.value

    setFormData(formData => ({ ...formData, beneficiary: updatedBeneficiary }))
  }, [])

  const handleLinkChange = useCallback(event => {
    const updatedLink = event.target.value
    setFormData(formData => ({ ...formData, link: updatedLink }))
  }, [])

  const handleOnContinue = useCallback(() => {
    setProposalData(formData)
    next()
  }, [formData, next, setProposalData])

  const [requestAmount, loadingRequestAmount] = useRequestAmount(
    formData.amount.stable,
    formData.amount.valueBN,
    stableToken.id,
    requestToken.id
  )

  const errors = useMemo(() => {
    const errors = []

    const { amount, beneficiary, link } = formData
    if (requestToken) {
      if (amount.valueBN.eq(-1)) {
        errors.push('Invalid requested amount')
      }

      if (beneficiary && !isAddress(beneficiary)) {
        errors.push('Beneficiary is not a valid ethereum address')
      }
    }

    if (link && !FORUM_POST_REGEX.test(link)) {
      errors.push('Forum post link not provided ')
    }

    return errors
  }, [formData, requestToken])

  const neededThreshold = useMemo(() => {
    const threshold = calculateThreshold(
      requestAmount,
      vaultBalance,
      effectiveSupply,
      alpha,
      maxRatio,
      weight
    )

    const max = getMaxConviction(effectiveSupply, alpha)

    return Math.round((threshold / max) * 100)
  }, [alpha, requestAmount, maxRatio, effectiveSupply, vaultBalance, weight])

  const submitDisabled =
    (formData.proposalType === FUNDING_PROPOSAL &&
      (formData.amount.valueBN.eq(0) || !formData.beneficiary)) ||
    !formData.title ||
    !formData.link ||
    errors.length > 0

  return (
    <form onSubmit={handleOnContinue}>
      <Field
        label="Select proposal type"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <DropDown
          header="Select proposal type"
          placeholder="Proposal type"
          selected={formData.proposalType}
          onChange={handleProposalTypeChange}
          items={PROPOSAL_TYPES}
          required
          wide
        />
      </Field>
      <Field
        label="Title"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          onChange={handleTitleChange}
          value={formData.title}
          wide
          required
        />
      </Field>
      {requestToken && fundingMode && (
        <>
          <RequestedAmount
            amount={formData.amount}
            convertedAmount={requestAmount}
            loadingAmount={loadingRequestAmount}
            neededThreshold={neededThreshold}
            onAmountChange={handleAmountChange}
            onBlur={() => handleAmountEditMode(false)}
            onIsStableChange={handleIsStableChange}
            onFocus={() => handleAmountEditMode(true)}
            requestToken={requestToken}
            stableToken={stableToken}
          />
          <Field label="Beneficiary">
            <TextInput
              onChange={handleBeneficiaryChange}
              value={formData.beneficiary}
              wide
              required
            />
          </Field>
        </>
      )}
      <Field label="Link">
        <TextInput
          onChange={handleLinkChange}
          value={formData.link}
          wide
          required
        />
      </Field>
      <Info title="Proposal guidelines">
        <span>
          {formData.proposalType === SIGNALING_PROPOSAL
            ? `This action will create a suggestion which can be voted on
            by ${stakeToken.symbol} holders but requests no funds. It is used to
            gather community sentiment for future funding proposals or
            particular ideas.`
            : `This action will create a funding proposal which can be voted on by ${stakeToken.symbol} holders. Funding will be granted if the accrued total stake reaches above the threshold.`}
        </span>{' '}
        In order to create a proposal you must first create a post on the{' '}
        <Link href="https://forum.1hive.org/new-topic?category=proposals">
          1Hive Forum
        </Link>{' '}
        under the 🌿 Proposals category and paste the link to the corresponding
        post in the LINK field.
      </Info>
      <Button
        wide
        mode="strong"
        type="submit"
        disabled={errors.length > 0 || submitDisabled}
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        Continue
      </Button>

      {errors.length > 0 && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Info>
      )}
    </form>
  )
})

function RequestedAmount({
  amount,
  convertedAmount,
  loadingAmount,
  neededThreshold,
  onAmountChange,
  onBlur,
  onFocus,
  onIsStableChange,
  requestToken,
  stableToken,
}) {
  const theme = useTheme()
  const { stable, value } = amount

  return (
    <>
      <Field label="Requested Amount" onFocus={onFocus} onBlur={onBlur}>
        <TextInput
          value={value}
          onChange={onAmountChange}
          required
          wide
          adornment={
            <span
              css={`
                background: ${theme.background};
                border-left: 1px solid ${theme.border};
                border-radius: 0px ${MEDIUM_RADIUS}px ${MEDIUM_RADIUS}px 0px;
                padding: 7px ${1.5 * GU}px;
              `}
            >
              {stable ? stableToken.symbol : requestToken.symbol}
            </span>
          }
          adornmentPosition="end"
          adornmentSettings={{ padding: 1 }}
        />
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: ${theme.contentSecondary};
            margin-top: ${0.75 * GU}px;
          `}
        >
          {stable ? (
            <ConvertedAmount
              amount={convertedAmount}
              loading={loadingAmount}
              requestToken={requestToken}
            />
          ) : (
            <div />
          )}
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Checkbox checked={stable} onChange={onIsStableChange} />
            <span>Stable amount ({stableToken.symbol})</span>
          </div>
        </div>
      </Field>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        If you specify the proposal amount in {stableToken.symbol} it will be
        converted to {requestToken.symbol} at time of execution.{' '}
        {neededThreshold
          ? `The conviction
        required in order for the proposal to pass with the requested amount is
        ~%${neededThreshold}.`
          : `Proposal might never pass with requested amount`}
      </Info>
    </>
  )
}

function ConvertedAmount({ amount, loading, requestToken }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        color: ${theme.content};
        font-weight: bold;
      `}
    >
      <span
        css={`
          margin-right: ${0.5 * GU}px;
        `}
      >
        ≈
      </span>
      {loading ? (
        <LoadingRing />
      ) : (
        <span>
          {formatTokenAmount(amount, requestToken.decimals)}{' '}
          {requestToken.symbol}
        </span>
      )}
    </div>
  )
}

export default AddProposalPanel
