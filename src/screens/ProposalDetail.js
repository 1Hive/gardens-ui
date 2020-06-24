import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BackButton,
  Bar,
  Box,
  Button,
  Field,
  GU,
  IconConnect,
  Info,
  Link,
  RADIUS,
  SidePanel,
  Slider,
  Split,
  TextInput,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import styled from 'styled-components'
import IdentityBadge from '../components/IdentityBadge'
import Balance from '../components/Balance'
import {
  ConvictionCountdown,
  ConvictionBar,
  ConvictionChart,
} from '../components/ConvictionVisuals'
import usePanelState from '../hooks/usePanelState'
import { useConvictionHistory } from '../hooks/useConvictionHistory'
import useAccountTotalStaked from '../hooks/useAccountTotalStaked'
import { addressesEqualNoSum as addressesEqual } from '../lib/web3-utils'
import { formatTokenAmount } from '../lib/token-utils'
import { round, safeDiv, toDecimals } from '../lib/math-utils'
import SupportProposal from '../components/panels/SupportProposal'
import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'

import BigNumber from '../lib/bigNumber'

const MAX_INPUT_DECIMAL_BASE = 6

function ProposalDetail({
  proposal,
  onBack,
  onExecuteProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
  requestToken,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const { account: connectedAccount } = useWallet()
  const chartLines = useConvictionHistory(proposal)
  const { stakeToken, accountBalance } = useAppState()
  const panelState = usePanelState()

  const {
    id,
    name,
    creator,
    beneficiary,
    link,
    requestedAmount,
    executed,
    currentConviction,
    stakes,
    threshold,
  } = proposal

  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) => addressesEqual(entity, connectedAccount)) || {
        amount: new BigNumber('0'),
      },
    [stakes, connectedAccount]
  )

  const myStakeAmountFormatted = formatTokenAmount(
    myStake.amount,
    stakeToken.decimals
  )

  const totalStaked = useAccountTotalStaked()

  const nonStakedTokens = useMemo(
    () => accountBalance.minus(totalStaked).plus(myStake.amount),
    [myStake.amount, accountBalance, totalStaked]
  )

  const formattedMaxAvailableAmount = useMemo(() => {
    if (!stakeToken) {
      return '0'
    }
    return formatTokenAmount(nonStakedTokens, stakeToken.decimals)
  }, [stakeToken, nonStakedTokens])

  const rounding = Math.min(MAX_INPUT_DECIMAL_BASE, stakeToken.decimals)

  const [
    { value: inputValue, max: maxAvailable, progress },
    setAmount,
    setProgress,
  ] = useAmount(
    myStakeAmountFormatted.replace(',', ''),
    formattedMaxAvailableAmount.replace(',', ''),
    rounding
  )

  const didIStaked = myStake?.amount.gt(0)

  const mode = useMemo(() => {
    if (currentConviction.gte(threshold)) {
      return 'execute'
    }
    if (didIStaked) {
      return 'update'
    }
    return 'support'
  }, [currentConviction, threshold, didIStaked])

  // Focus input
  const inputRef = useRef(null)

  const handleExecute = useCallback(() => {
    onExecuteProposal(id)
  }, [id, onExecuteProposal])

  const handleChangeSupport = useCallback(() => {
    const newValue = new BigNumber(toDecimals(inputValue, stakeToken.decimals))

    if (newValue.lt(myStake.amount)) {
      onWithdrawFromProposal(id, myStake.amount.minus(newValue).toString(10))
      return
    }

    onStakeToProposal(id, newValue.minus(myStake.amount).toString(10))
  }, [
    id,
    inputValue,
    myStake.amount,
    stakeToken.decimals,
    onStakeToProposal,
    onWithdrawFromProposal,
  ])

  const buttonProps = useMemo(() => {
    if (mode === 'execute') {
      return {
        text: 'Execute proposal',
        action: handleExecute,
        mode: 'strong',
        disabled: false,
      }
    }

    if (mode === 'update') {
      return {
        text: 'Change support',
        action: handleChangeSupport,
        mode: 'normal',
        disabled: myStakeAmountFormatted === inputValue.toString(),
      }
    }
    return {
      text: 'Support this proposal',
      action: panelState.requestOpen,
      mode: 'strong',
      disabled: !accountBalance.gt(0),
    }
  }, [
    mode,
    handleExecute,
    handleChangeSupport,
    panelState,
    myStakeAmountFormatted,
    inputValue,
    accountBalance,
  ])

  return (
    <div>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>
      <Split
        primary={
          <div>
            <Box>
              <section
                css={`
                  display: grid;
                  grid-template-rows: auto;
                  grid-gap: ${2.5 * GU}px;
                  margin-top: ${2.5 * GU}px;
                `}
              >
                <h1
                  css={`
                    ${textStyle('title2')};
                    font-weight: 600;
                  `}
                >
                  #{id} {name}
                </h1>
                <div
                  css={`
                    display: grid;
                    grid-template-columns: ${layoutName !== 'small'
                      ? 'auto auto auto auto'
                      : 'auto'};
                    grid-gap: ${layoutName !== 'small' ? 5 * GU : 2.5 * GU}px;
                  `}
                >
                  {requestToken && (
                    <Amount
                      requestedAmount={requestedAmount}
                      requestToken={requestToken}
                    />
                  )}
                  <div>
                    <Heading color={theme.surfaceContentSecondary}>
                      Link
                    </Heading>
                    {link ? (
                      <Link href={link} external>
                        Read more
                      </Link>
                    ) : (
                      <span
                        css={`
                          ${textStyle('body2')};
                        `}
                      >
                        No link provided
                      </span>
                    )}
                  </div>
                  <div>
                    <Heading color={theme.surfaceContentSecondary}>
                      Created By
                    </Heading>
                    <div
                      css={`
                        display: flex;
                        align-items: flex-start;
                      `}
                    >
                      <IdentityBadge
                        connectedAccount={addressesEqual(
                          creator,
                          connectedAccount
                        )}
                        entity={creator}
                      />
                    </div>
                  </div>
                  {requestToken && (
                    <div>
                      <Heading color={theme.surfaceContentSecondary}>
                        Beneficiary
                      </Heading>
                      <div
                        css={`
                          display: flex;
                          align-items: flex-start;
                        `}
                      >
                        <IdentityBadge
                          connectedAccount={addressesEqual(
                            beneficiary,
                            connectedAccount
                          )}
                          entity={beneficiary}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!executed && (
                  <React.Fragment>
                    <div css="width: 100%;">
                      <Heading color={theme.surfaceContentSecondary}>
                        Conviction prediction
                      </Heading>
                      <ConvictionChart
                        proposal={proposal}
                        withThreshold={!!requestToken}
                        lines={chartLines}
                      />
                    </div>
                    {connectedAccount ? (
                      <>
                        {mode === 'update' && (
                          <Field label="Amount of your tokens for this proposal">
                            <div
                              css={`
                                display: flex;
                                justify-content: space-between;
                              `}
                            >
                              <div
                                css={`
                                  width: 100%;
                                `}
                              >
                                <Slider
                                  css={`
                                    display: flex;
                                    justify-content: space-between;
                                  `}
                                  value={progress}
                                  onUpdate={setProgress}
                                />
                              </div>
                              <TextInput
                                value={inputValue}
                                onChange={setAmount}
                                type="number"
                                max={maxAvailable}
                                min="0"
                                required
                                ref={inputRef}
                                css={`
                                  width: ${18 * GU}px;
                                `}
                              />
                            </div>
                          </Field>
                        )}
                        <Button
                          wide
                          mode={buttonProps.mode}
                          onClick={buttonProps.action}
                          disabled={buttonProps.disabled}
                        >
                          {buttonProps.text}
                        </Button>
                        {mode === 'support' && buttonProps.disabled && (
                          <Info mode="warning">
                            The currently connected account does not hold any{' '}
                            <strong>{stakeToken.symbol}</strong> tokens and
                            therefore cannot participate in this proposal. Make
                            sure your account is holding{' '}
                            <strong>{stakeToken.symbol}</strong>.
                          </Info>
                        )}
                      </>
                    ) : (
                      <AccountNotConnected />
                    )}
                  </React.Fragment>
                )}
              </section>
            </Box>
          </div>
        }
        secondary={
          <div>
            {requestToken && (
              <Box heading="Status">
                <ConvictionCountdown proposal={proposal} />
              </Box>
            )}
            {!proposal.executed && (
              <Box heading="Conviction Progress">
                <ConvictionBar
                  proposal={proposal}
                  withThreshold={!!requestToken}
                />
              </Box>
            )}
          </div>
        }
      />
      <SidePanel
        title="Support this proposal"
        opened={panelState.visible}
        onClose={panelState.requestClose}
      >
        <SupportProposal
          id={id}
          onDone={panelState.requestClose}
          onStakeToProposal={onStakeToProposal}
        />
      </SidePanel>
    </div>
  )
}

const AccountNotConnected = () => {
  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background: ${theme.background};
        padding: ${3.5 * GU}px ${10 * GU}px;
        text-align: center;
      `}
    >
      <div
        css={`
          ${textStyle('body1')};
        `}
      >
        You must enable your account to interact on this proposal
      </div>
      <div
        css={`
          ${textStyle('body2')};
          color: ${theme.surfaceContentSecondary};
          margin-top: ${2 * GU}px;
        `}
      >
        Connect to your Ethereum provider by clicking on the{' '}
        <strong
          css={`
            display: inline-flex;
            align-items: center;
            position: relative;
            top: 7px;
          `}
        >
          <IconConnect /> Enable account
        </strong>{' '}
        button on the header. You may be temporarily redirected to a new screen.
      </div>
    </div>
  )
}

const useAmount = (balance, maxAvailable, rounding) => {
  const [amount, setAmount] = useState({
    value: balance,
    max: maxAvailable,
    progress: safeDiv(balance, maxAvailable),
  })

  useEffect(() => {
    setAmount(prevState => {
      if (prevState.max === maxAvailable) {
        return prevState
      }
      const newValue = round(prevState.progress * maxAvailable, rounding)

      return {
        ...prevState,
        value: String(newValue),
        max: maxAvailable,
      }
    })
  }, [maxAvailable, rounding])

  useEffect(() => {
    setAmount(prevState => {
      if (prevState.value === balance) {
        return prevState
      }

      return {
        ...prevState,
        value: balance,
        progress: safeDiv(balance, maxAvailable),
      }
    })
  }, [balance, maxAvailable])

  const handleAmountChange = useCallback(
    event => {
      const newValue = Math.min(event.target.value, maxAvailable)
      const newProgress = safeDiv(newValue, maxAvailable)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [maxAvailable]
  )

  const handleSliderChange = useCallback(
    newProgress => {
      const newValue =
        newProgress === 1
          ? round(Number(maxAvailable), rounding)
          : round(newProgress * maxAvailable, 2)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [maxAvailable, rounding]
  )

  return [amount, handleAmountChange, handleSliderChange]
}

const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => (
  <div>
    <Heading color={useTheme().surfaceContentSecondary}>Amount</Heading>
    <Balance
      amount={requestedAmount}
      decimals={decimals}
      symbol={symbol}
      verified={verified}
    />
  </div>
)

const Heading = styled.h2`
  ${textStyle('label2')};
  color: ${props => props.color};
  margin-bottom: ${1.5 * GU}px;
`

export default ProposalDetail
