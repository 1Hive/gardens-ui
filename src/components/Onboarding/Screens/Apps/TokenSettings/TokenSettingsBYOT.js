import React, { useCallback, useEffect, useState } from 'react'
import {
  Field,
  GU,
  Help,
  Info,
  isAddress,
  LoadingRing,
  TextInput,
} from '@1hive/1hive-ui'
import Header from '../../../kit/Header'
import Navigation from '../../../Navigation'
import { useTokenData } from '@hooks/useToken'
import { useOnboardingState } from '@providers/Onboarding'

import iconError from '@assets/iconError.svg'
import iconCheck from '@assets/iconCheck.svg'

function useFieldsLayout() {
  return `
    display: grid;
    grid-template-columns: 8fr 1fr 1fr;
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

function TokenSettingsBYOT() {
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
  const [gardenTokenName, setGardenTokenName] = useState(config.tokens.name)
  const [gardenTokenSymbol, setGardenTokenSymbol] = useState(
    config.tokens.symbol
  )

  const handleTokenAddressChange = useCallback(event => {
    setFormError(null)
    setTokenAddress(event.target.value)
  }, [])
  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setGardenTokenName(event.target.value)
  }, [])
  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setGardenTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const handleNext = useCallback(
    event => {
      event.preventDefault()

      const error = validationError(
        tokenAddress,
        gardenTokenName,
        gardenTokenSymbol
      )
      setFormError(error)

      if (!error) {
        onConfigChange('tokens', {
          address: tokenAddress,
          name: gardenTokenName,
          symbol: gardenTokenSymbol,
          decimals: tokenData.decimals,
          existingTokenSymbol: tokenData.symbol,
        })
        onConfigChange('conviction', {
          requestToken: tokenAddress,
        })
        onNext()
      }
    },
    [
      gardenTokenName,
      gardenTokenSymbol,
      onConfigChange,
      onNext,
      tokenAddress,
      tokenData,
    ]
  )
  useEffect(() => {
    if (
      isAddress(tokenAddress) &&
      !tokenDataError &&
      tokenData.name &&
      tokenData.symbol &&
      !loadingTokenData
    ) {
      setGardenTokenName(`Garden ${tokenData.name}`)
      setGardenTokenSymbol(`g${tokenData.symbol}`)
    } else {
      setGardenTokenName('')
      setGardenTokenSymbol('')
    }
  }, [tokenData, loadingTokenData, tokenAddress, tokenDataError])

  return (
    <form
      css={`
        display: grid;
      `}
    >
      <div>
        <Header
          title="Garden Tokenomics"
          subtitle="Garden token"
          thirdtitle="Choose the settings of your token"
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
                  <strong>Token Address</strong> is the address of an existent
                  ERC-20 token to use within your garden.
                </Help>
              </React.Fragment>
            }
            css={`
              grid-column: 1/3;
            `}
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
              gardenTokenSymbol &&
              gardenTokenName &&
              !loadingTokenData && <img src={iconCheck} />}

            {tokenDataError && !loadingTokenData && isAddress(tokenAddress) && (
              <img src={iconError} />
            )}
          </div>

          <Field
            label={
              <React.Fragment>
                Garden Token Name
                <Help hint="What is Token Name?">
                  <strong>Garden Token Name</strong> is the name you can assign
                  to the token that will be minted when creating this garden.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenNameChange}
                placeholder="Garden Token Name"
                value={gardenTokenName}
                disabled={!gardenTokenName}
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
                  name (typically in capital letters) that refers to a token on
                  a trading platform. For example: HNY.
                </Help>
              </React.Fragment>
            }
            css={`
              grid-column: 2/4;
            `}
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenSymbolChange}
                value={gardenTokenSymbol}
                placeholder="MCT"
                disabled={!gardenTokenSymbol}
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
      {gardenTokenName && gardenTokenSymbol && (
        <Info
          mode="warning"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          We recommend sticking with the default syntax unless you have a good
          reason not to.
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
          margin-bottom: ${4 * GU}px;
        `}
      >
        Add the address of an existent ERC-20 token you want to use within your
        Garden. These settings will determine the name and symbol of a new token
        that will govern your community.
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

export default TokenSettingsBYOT
