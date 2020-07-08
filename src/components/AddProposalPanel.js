import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  isAddress,
  MEDIUM_RADIUS,
  TextInput,
  useTheme,
} from '@1hive/1hive-ui'
import { useAppState } from '../providers/AppState'

import BigNumber from '../lib/bigNumber'
import { toDecimals } from '../lib/math-utils'
import { formatTokenAmount } from '../lib/token-utils'
import { calculateThreshold, getMaxConviction } from '../lib/conviction'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

const AddProposalPanel = React.memo(({ onSubmit }) => {
  const theme = useTheme()
  const {
    alpha,
    maxRatio,
    requestToken,
    stakeToken,
    totalSupply,
    vaultBalance,
    weight,
  } = useAppState()

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    amount: {
      value: '0',
      valueBN: new BigNumber(0),
    },
    beneficiary: '',
  })

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
          value: updatedAmount,
          valueBN: newAmountBN,
        },
      }))
    },
    [stakeToken.decimals]
  )

  const handleBeneficiaryChange = useCallback(event => {
    const updatedBeneficiary = event.target.value

    setFormData(formData => ({ ...formData, beneficiary: updatedBeneficiary }))
  }, [])

  const handleLinkChange = useCallback(event => {
    const updatedLink = event.target.value
    setFormData(formData => ({ ...formData, link: updatedLink }))
  }, [])

  const handleFormSubmit = useCallback(
    event => {
      event.preventDefault()

      const { amount, beneficiary = ZERO_ADDR, link, title } = formData
      const convertedAmount = amount.valueBN.toString(10)

      onSubmit({ title, link, amount: convertedAmount, beneficiary })
    },
    [formData, onSubmit]
  )

  const errors = useMemo(() => {
    const errors = []

    const { amount, beneficiary, title } = formData
    if (requestToken) {
      if (amount.valueBN.eq(-1)) {
        errors.push('Invalid requested amount')
      }

      if (beneficiary && !isAddress(beneficiary)) {
        errors.push('Beneficiary is not a valid ethereum address')
      }

      return errors
    }

    return !title
  }, [formData, requestToken])

  const neededThreshold = useMemo(() => {
    const threshold = calculateThreshold(
      formData.amount.valueBN,
      vaultBalance,
      totalSupply,
      alpha,
      maxRatio,
      weight
    )

    const max = getMaxConviction(totalSupply, alpha)

    return Math.round((threshold / max) * 100)
  }, [alpha, formData.amount, maxRatio, totalSupply, vaultBalance, weight])

  return (
    <form onSubmit={handleFormSubmit}>
      <Info
        title="Action"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        This action will create a proposal which can be voted on by staking{' '}
        {stakeToken.symbol}. The action will be executable if the accrued total
        stake reaches above the threshold.
      </Info>
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
      {requestToken && (
        <>
          <Field
            label="Requested Amount"
            onFocus={() => handleAmountEditMode(true)}
            onBlur={() => handleAmountEditMode(false)}
          >
            <TextInput
              value={formData.amount.value}
              onChange={handleAmountChange}
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
                  {requestToken.symbol}
                </span>
              }
              adornmentPosition="end"
              adornmentSettings={{ padding: 1 }}
            />
          </Field>
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
        <TextInput onChange={handleLinkChange} value={formData.link} wide />
      </Field>
      {errors.length > 0 && (
        <Info
          mode="warning"
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Info>
      )}
      <Button wide mode="strong" type="submit" disabled={errors.length > 0}>
        Submit
      </Button>
      {formData.amount.valueBN.gte(0) && (
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
    </form>
  )
})

export default AddProposalPanel
