import React, { useCallback, useEffect, useState } from 'react'
import {
  Field,
  GU,
  Help,
  Info,
  IconCheck,
  IconCross,
  isAddress,
  LoadingRing,
  TextInput,
  theme,
} from '@1hive/1hive-ui'
import Navigation from '../../Navigation'
import { useOnboardingState } from '@providers/Onboarding'
import { useTokenData } from '@hooks/useToken'
import Header from '../../kit/Header'

function useFieldsLayout() {
  return `
    display: grid;
    grid-template-columns: auto ${21 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}
function validationError(tokenAddress, tokenName, tokenSymbol) {
  if (!tokenAddress) {
    return 'Please, provide a token address'
  }
  if (!isAddress(tokenAddress)) {
    return 'The token address you provided is invalid.'
  }
  if (!tokenName.trim()) {
    return 'Please add a token name.'
  }
  if (!tokenSymbol) {
    return 'Please add a token symbol.'
  }
  return null
}

function TokensSettingsBYOT() {
  const fieldsLayout = useFieldsLayout()

  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    steps,
    step,
  } = useOnboardingState()

  const [formError, setFormError] = useState(null)
  const [tokenAddress, setTokenAddress] = useState(config.tokens.address)
  const [tokenData, loadingTokenData, tokenDataError] = useTokenData(
    isAddress(tokenAddress) && tokenAddress
  )
  const [gTokenName, setGTokenName] = useState(config.tokens.name)
  const [gTokenSymbol, setGTokenSymbol] = useState(config.tokens.symbol)

  const handleTokenAddressChange = useCallback(event => {
    setFormError(null)
    setTokenAddress(event.target.value)
  }, [])
  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setGTokenName(event.target.value)
  }, [])
  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setGTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const handleNext = useCallback(
    event => {
      event.preventDefault()

      const error = validationError(tokenAddress, gTokenName, gTokenSymbol)
      setFormError(error)

      if (!error) {
        onConfigChange('tokens', {
          address: tokenAddress,
          name: gTokenName,
          symbol: gTokenSymbol,
          decimals: tokenData.decimals,
          existingTokenSymbol: tokenData.symbol,
        })
        onNext()
      }
    },
    [gTokenName, gTokenSymbol, onConfigChange, onNext, tokenAddress, tokenData]
  )

  useEffect(() => {
    if (
      isAddress(tokenAddress) &&
      !tokenDataError &&
      tokenData.name &&
      tokenData.symbol &&
      !loadingTokenData
    ) {
      setGTokenName(`Garden ${tokenData.name}`)
      setGTokenSymbol(`g${tokenData.symbol}`)
    } else {
      setGTokenName('')
      setGTokenSymbol('')
    }
  }, [tokenData, loadingTokenData, tokenAddress, tokenDataError])

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={`
          width: 752px;
        `}
      >
        <Header
          title="Configure Garden Token"
          subtitle={<span>Choose your settings below.</span>}
        />
        <div
          css={`
            ${fieldsLayout};
          `}
        >
          <Field
            label={
              <React.Fragment>
                Token address
                <Help hint="What is Token Address?">
                  <strong>Token Address</strong> is the address of the token you
                  want to bring to the garden.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenAddressChange}
                placeholder="Token Address"
                value={tokenAddress}
                wide
              />
            )}
          </Field>
          <div
            css={`
              display: flex;
              margin: auto auto auto ${2 * GU}px;
            `}
          >
            {loadingTokenData && (
              <LoadingRing
                mode="half-circle"
                css={`
                  & > svg {
                    height: ${2 * GU}px;
                    width: ${2 * GU}px;
                `}
              />
            )}

            {!tokenDataError &&
              gTokenSymbol &&
              gTokenName &&
              !loadingTokenData && <IconCheck color={theme.positive} />}

            {tokenDataError && !loadingTokenData && isAddress(tokenAddress) && (
              <IconCross color={theme.negative} />
            )}
          </div>

          <Field
            label={
              <React.Fragment>
                Garden Token Name
                <Help hint="What is Token Name?">
                  <strong>Garden Token Name</strong> is the name you can assign
                  to the token you are bringing to this garden.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenNameChange}
                placeholder="Garden Token Name"
                value={gTokenName}
                disabled={!gTokenName}
                wide
              />
            )}
          </Field>

          <Field
            label={
              <React.Fragment>
                Garden Token Symbol
                <Help hint="What is Token Symbol?">
                  <strong>Garden Token Symbol</strong> or ticker is a shortened
                  name (typically in capital letters) that refers to a token or
                  coin on a trading platform. For example: HNY.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenSymbolChange}
                value={gTokenSymbol}
                placeholder="MCT"
                disabled={!gTokenSymbol}
                wide
              />
            )}
          </Field>
        </div>
      </div>

      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}
      {gTokenName && gTokenSymbol && (
        <Info
          mode="warning"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          We recommend sticking with the default syntax here unless you have a
          good reason not to.
        </Info>
      )}

      {isAddress(tokenAddress) && tokenDataError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          The address you provided does not match with a token contract.
        </Info>
      )}

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings will determine the name and symbol of your community
        token. Add the address of the token you want to bring to your Garden.
      </Info>

      <Navigation
        backEnabled
        nextEnabled
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNext}
      />
    </form>
  )
}

export default TokensSettingsBYOT
