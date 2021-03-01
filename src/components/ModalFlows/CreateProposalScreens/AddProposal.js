import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  Field,
  GU,
  Info,
  isAddress,
  Link,
  LoadingRing,
  MEDIUM_RADIUS,
  TextInput,
  textStyle,
  useTheme,
  Radio,
  RadioGroup,
} from '@1hive/1hive-ui'
import { useAppState } from '../../../providers/AppState'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import useRequestedAmount from '../../../hooks/useRequestedAmount'

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

const PROPOSAL_TYPES = ['Signaling proposal', 'Funding proposal']

const AddProposalPanel = React.memo(({ setProposalData }) => {
  const { next } = useMultiModal()
  const {
    config,
    requestToken,
    stakeToken,
    effectiveSupply,
    vaultBalance,
  } = useAppState()
  const { alpha, maxRatio, stableToken, weight } = config.conviction

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

  const [convertedAmount, loadingRequestedAmount] = useRequestedAmount(
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
      convertedAmount,
      vaultBalance,
      effectiveSupply,
      alpha,
      maxRatio,
      weight
    )

    const max = getMaxConviction(effectiveSupply, alpha)

    return Math.round((threshold / max) * 100)
  }, [alpha, convertedAmount, maxRatio, effectiveSupply, vaultBalance, weight])

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
        <RadioGroup
          onChange={handleProposalTypeChange}
          selected={formData.proposalType}
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          <div
            css={`
              display: flex;
              justify-content: space-between;
              flex-direction: column;
            `}
          >
            {PROPOSAL_TYPES.map((label, i) => {
              return (
                <label key={i}>
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      ${textStyle('body2')};
                    `}
                  >
                    <Radio id={i} />
                    <span>{label}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </RadioGroup>
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
            convertedAmount={convertedAmount}
            loadingAmount={loadingRequestedAmount}
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
        In order to create a proposal you must first create a post on the{' '}
        <Link href="https://forum.1hive.org/new-topic?category=proposals">
          1Hive Forum
        </Link>{' '}
        under the 🌿 Proposals category and paste the link to the corresponding
        post in the LINK field.
        {fundingMode ? (
          <>
            <span>
              This action will create a proposal which can be voted on
            </span>{' '}
            <span
              css={`
                font-weight: 700;
              `}
            >
              by staking {stakeToken.symbol}.
            </span>{' '}
            <span>
              The action will be executable if the accrued total stake reaches
              above the threshold.
            </span>
          </>
        ) : (
          <>
            <span>
              This action will create a proposal which can be voted on,
            </span>{' '}
            <span
              css={`
                font-weight: 700;
              `}
            >
              it’s a proposal without a requested amount.
            </span>{' '}
            <span>The action will not be executable.</span>
          </>
        )}
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

      {fundingMode && formData.amount.valueBN.gte(0) && (
        <Info
          mode={neededThreshold ? 'info' : 'warning'}
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {neededThreshold
            ? `Required conviction for requested amount in order for the proposal to
          pass is ~%${neededThreshold}`
            : `Proposal might never pass with requested amount`}
        </Info>
      )}

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
        converted to {requestToken.symbol} at time of execution
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
