import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  DropDown,
  Field,
  GU,
  Help,
  Info,
  isAddress,
  Link,
  LoadingRing,
  MEDIUM_RADIUS,
  TextInput,
  useTheme,
} from '@1hive/1hive-ui'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@providers/GardenState'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import { usePriceOracle } from '@hooks/usePriceOracle'
import BigNumber from '@lib/bigNumber'
import { toDecimals } from '@utils/math-utils'
import { escapeRegex, regexToCheckValidProposalURL } from '@utils/regex-utils'
import { formatTokenAmount, isStableToken } from '@utils/token-utils'
import { calculateThreshold, getMaxConviction } from '@lib/conviction'

import { useHistory } from 'react-router-dom'
import { buildGardenPath } from '@utils/routing-utils'
import { TokenType } from '@/types/app'

const SIGNALING_PROPOSAL = 0
const FUNDING_PROPOSAL = 1
const POLL = 2

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

const PROPOSAL_TYPES = ['Suggestion', 'Funding', 'Poll']

type AddProposalPanelProps = {
  setProposalData: (proposal: any) => void
}

const AddProposalPanel = ({ setProposalData }: AddProposalPanelProps) => {
  const { next } = useMultiModal()
  const { commonPool, config } = useGardenState()
  const {
    alpha,
    effectiveSupply,
    maxRatio,
    requestToken,
    stableToken,
    stakeToken,
    weight,
  } = config.conviction

  const connectedGarden = useConnectedGarden()
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const fundingMode = formData.proposalType === FUNDING_PROPOSAL

  // Escaping forumURL to avoid misuse with regexp
  const forumRegex = regexToCheckValidProposalURL(
    escapeRegex(connectedGarden.forumURL)
  )

  const handleAmountEditMode = useCallback(
    (editMode) => {
      setFormData((formData) => {
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

  const handleIsStableChange = useCallback((checked) => {
    setFormData((formData) => ({
      ...formData,
      amount: { ...formData.amount, stable: checked },
    }))
  }, [])

  const handleTitleChange = useCallback((event) => {
    const updatedTitle = event.target.value
    setFormData((formData) => ({ ...formData, title: updatedTitle }))
  }, [])

  const handleAmountChange = useCallback(
    (event) => {
      const updatedAmount = event.target.value

      const newAmountBN = new BigNumber(
        isNaN(updatedAmount)
          ? -1
          : toDecimals(updatedAmount, stakeToken.decimals)
      )

      setFormData((formData) => ({
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

  const handleProposalTypeChange = useCallback((selected) => {
    setFormData((formData) => ({
      ...formData,
      proposalType: selected,
    }))
  }, [])

  const handleBeneficiaryChange = useCallback((event) => {
    const updatedBeneficiary = event.target.value

    setFormData((formData) => ({
      ...formData,
      beneficiary: updatedBeneficiary,
    }))
  }, [])

  const handleLinkChange = useCallback((event) => {
    const updatedLink = event.target.value
    setFormData((formData) => ({ ...formData, link: updatedLink }))
  }, [])

  const handleOnContinue = useCallback(
    (event) => {
      event.preventDefault()

      // Tweak to allow proposal poll
      setProposalData({
        ...formData,
        title:
          formData.proposalType === POLL
            ? `Poll - ${formData.title}`
            : formData.title,
        proposalType:
          formData.proposalType === POLL ? 3 : formData.proposalType,
      })
      next()
    },
    [formData, next, setProposalData]
  )

  const [requestAmount, loadingRequestAmount] = usePriceOracle(
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

    if (link && !forumRegex.test(link)) {
      errors.push('Proposal information URL not provided or not valid')
    }

    return errors
  }, [formData, forumRegex, requestToken])

  const neededThreshold = useMemo(() => {
    const threshold = calculateThreshold(
      requestAmount as any,
      commonPool,
      effectiveSupply,
      alpha,
      maxRatio,
      weight
    )

    const max = getMaxConviction(effectiveSupply, alpha)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Math.round((threshold / max) * 100)
  }, [alpha, commonPool, effectiveSupply, maxRatio, requestAmount, weight])

  const submitDisabled =
    !formData.title ||
    !formData.link ||
    errors.length > 0 ||
    (formData.proposalType === FUNDING_PROPOSAL &&
      (formData.amount.valueBN.eq(0) || !formData.beneficiary))

  const history = useHistory()
  return (
    <form onSubmit={handleOnContinue}>
      <Info title="Proposal guidelines">
        All proposals are bound by this community&apos;s{' '}
        <Link href={`#${buildGardenPath(history.location, 'covenant')}`}>
          Covenant
        </Link>{' '}
        . If you haven&apos;t taken the time to read through it yet, please make
        sure you do so.
        <br />
        <br /> Before creating a proposal you must first create a post on the{' '}
        <Link href={connectedGarden.forumURL}>
          {connectedGarden.name} Forum
        </Link>{' '}
        . This post should explain why you believe this proposal is beneficial
        to the community and (if applicable) what the requested funds will be
        used for.
      </Info>
      <Field
        label="Select proposal type"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <DropDown
          header="Select proposal type"
          placeholder="Select proposal type"
          selected={formData.proposalType}
          onChange={handleProposalTypeChange}
          items={PROPOSAL_TYPES}
          required
          wide
        />
      </Field>
      <Info>
        <span>
          {formData.proposalType === SIGNALING_PROPOSAL
            ? `Suggestion proposals are used to gather community sentiment for
        ideas or future funding proposals.`
            : `Funding proposals ask for an amount of funds. These funds are granted
        if the proposal in question receives enough support (conviction).`}
        </span>{' '}
      </Info>
      <Field
        label="Title"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          onChange={handleTitleChange}
          placeholder={`Add the title of the ${
            formData.proposalType === POLL ? 'poll' : 'proposal'
          }`}
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
          <Field label="Beneficiary address">
            <TextInput
              onChange={handleBeneficiaryChange}
              value={formData.beneficiary}
              placeholder="Add the beneficiary’s ETH address"
              wide
              required
            />
          </Field>
        </>
      )}
      <Field label="Proposal Information URL">
        <TextInput
          onChange={handleLinkChange}
          value={formData.link}
          placeholder="Add Proposal information URL"
          wide
          required
        />
      </Field>
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
          mode={Info?.MODES?.WARNING ?? 'warning'}
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
}

type RequestedAmountProps = {
  amount: {
    stable: boolean
    value: string
    valueBN: BigNumber
  }
  convertedAmount: boolean | BigNumber
  loadingAmount: boolean | BigNumber
  neededThreshold: number
  onAmountChange: (event: any) => void
  onBlur: () => void
  onFocus: () => void
  onIsStableChange: any
  requestToken: TokenType
  stableToken: TokenType
}

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
}: RequestedAmountProps) {
  const theme = useTheme()
  const { stable, value } = amount

  const isRequestTokenStable = isStableToken(requestToken)

  return (
    <>
      <Field label="Requested Amount" onFocus={onFocus} onBlur={onBlur}>
        <TextInput
          value={value}
          onChange={onAmountChange}
          placeholder="Add the requested amount"
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
        {!isRequestTokenStable && (
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
              <div
                css={`
                  margin-left: ${1 * GU}px;
                `}
              >
                <Help hint="">
                  For funding proposals denominated in {stableToken.symbol} to
                  be made successfully, this Garden&apos;s{' '}
                  <Link href="https://1hive.gitbook.io/gardens/garden-creators/price-oracle">
                    price oracle
                  </Link>{' '}
                  must be called consistently. Contact your Garden administrator
                  or development team if the requested stable amount is not
                  accurate.
                </Help>
              </div>
            </div>
          </div>
        )}
      </Field>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        The larger the requested amount, the more support required for the
        proposal to pass.{' '}
        {isRequestTokenStable
          ? ''
          : `If you specify the proposal amount in ${stableToken.symbol} it will be converted to ${requestToken.symbol} if/when it is passed.`}{' '}
        {neededThreshold
          ? `The conviction
        required in order for the proposal to pass with the requested amount is
        ≈${neededThreshold}%.`
          : `The requested amount is extremely high; there's a good chance the proposal might never pass.`}
      </Info>
    </>
  )
}

// TODO: check this types
type ConvertedAmountProps = {
  amount: boolean | BigNumber
  loading: boolean | BigNumber
  requestToken: TokenType
}

const ConvertedAmount = ({
  amount,
  loading,
  requestToken,
}: ConvertedAmountProps) => {
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

export default React.memo(AddProposalPanel)
