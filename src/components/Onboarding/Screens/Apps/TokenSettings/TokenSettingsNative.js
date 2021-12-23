import React, { useCallback, useEffect, useRef, useState } from 'react'

import PropTypes from 'prop-types'

import {
  Button,
  EthIdenticon,
  Field,
  GU,
  Help,
  IconPlus,
  IconTrash,
  Info,
  RADIUS,
  TextInput,
  isAddress,
  useTheme,
} from '@1hive/1hive-ui'

import { useOnboardingState } from '@providers/Onboarding'

import Navigation from '../../../Navigation'
import Header from '../../../kit/Header'
import GnosisSafeField from './GnosisSafeField'

function useFieldsLayout() {
  return `
    display: grid;
    grid-template-columns: auto ${14.5 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}

function validateDuplicateAddresses(members) {
  const validAddresses = members
    .map(([address]) => address.toLowerCase())
    .filter((address) => isAddress(address))

  return validAddresses.length === new Set(validAddresses).size
}

function validationError(
  tokenName,
  tokenSymbol,
  members,
  gnosisSafeAddress,
  gnosisSafeChecked
) {
  if (members.some(([address]) => !isAddress(address))) {
    return 'Holders: Every address you provide should be a valid address.'
  }
  if (members.some(([account, stake]) => !(stake > 0))) {
    return 'Holders: Every account has to have a positive balance.'
  }
  if (!validateDuplicateAddresses(members)) {
    return 'One of your members is using the same address than another member. Please ensure every member address is unique.'
  }
  if (!tokenName.trim()) {
    return 'Please add a token name.'
  }
  if (!tokenSymbol) {
    return 'Please add a token symbol.'
  }
  if (gnosisSafeChecked && !isAddress(gnosisSafeAddress)) {
    return 'The Gnosis safe address you provided is invalid.'
  }
  return null
}

function TokenSettingsNative() {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const { config, onBack, onNext, steps, step, onConfigChange } =
    useOnboardingState()

  const [formError, setFormError] = useState()
  const [tokenName, setTokenName] = useState(config.tokens.name)
  const [tokenSymbol, setTokenSymbol] = useState(config.tokens.symbol)
  const [members, setMembers] = useState(
    config.tokens.holders.length === 0 ? [['', 0]] : config.tokens.holders
  )
  const [gnosisSafeAddress, setGnosisSafeAddress] = useState(
    config.tokens.gnosisSafe
  )
  const [gnosisSafeChecked, setGnosisSafeChecked] = useState(
    Boolean(config.tokens.gnosisSafe)
  )

  const handleTokenNameChange = useCallback((event) => {
    setFormError(null)
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback((event) => {
    setFormError(null)
    setTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const membersRef = useRef()
  const [focusLastMemberNext, setFocusLastMemberNext] = useState(false)

  useEffect(() => {
    if (!focusLastMemberNext || !membersRef.current) {
      return
    }

    setFocusLastMemberNext(false)

    // This could be managed in individual MemberField components, but using
    // the container with a .member class makes it simpler to manage, since we
    // want to focus in three cases:
    //   - A new field is being added.
    //   - A field is being removed.
    //   - The first field is being emptied.
    //
    const elts = membersRef.current.querySelectorAll('.member')
    if (elts.length > 0) {
      elts[elts.length - 1].querySelector('input').focus()
    }
  }, [focusLastMemberNext])

  const focusLastMember = useCallback(() => {
    setFocusLastMemberNext(true)
  }, [])

  const addMember = useCallback(() => {
    setFormError(null)
    setMembers((members) => [...members, ['', 0]])
    focusLastMember()
  }, [focusLastMember])

  const removeMember = useCallback(
    (index) => {
      setFormError(null)
      setMembers((members) =>
        members.length < 2
          ? // When the remove button of the last field
            // gets clicked, we only empty the field.
            [['', 0]]
          : members.filter((_, i) => i !== index)
      )
      focusLastMember()
    },
    [focusLastMember]
  )

  const updateMember = useCallback((index, updatedAccount, updatedStake) => {
    setFormError(null)
    setMembers((members) =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  const handleGnosisSafeAddressChange = useCallback((newAddress) => {
    setFormError(null)
    setGnosisSafeAddress(newAddress)
  }, [])

  const handleGnosisSafeCheckChange = useCallback((checked) => {
    setGnosisSafeChecked(checked)
  }, [])

  const handleNext = useCallback(
    (event) => {
      event.preventDefault()

      const error = validationError(
        tokenName,
        tokenSymbol,
        members,
        gnosisSafeAddress,
        gnosisSafeChecked
      )
      if (error) {
        setFormError(error)
        return
      }

      onConfigChange('tokens', {
        name: tokenName,
        symbol: tokenSymbol,
        holders: members,
        gnosisSafe: gnosisSafeAddress,
      })
      onNext()
    },
    [
      gnosisSafeAddress,
      gnosisSafeChecked,
      members,
      onConfigChange,
      onNext,
      tokenName,
      tokenSymbol,
    ]
  )

  const hideRemoveButton = members.length < 2 && !members[0]

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
                Token name
                <Help hint="What is Token Name?">
                  <strong>Token Name</strong> is the name you can assign to the
                  token that will be minted when creating this garden.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenNameChange}
                placeholder="My Community Token"
                value={tokenName}
                wide
              />
            )}
          </Field>

          <Field
            label={
              <React.Fragment>
                Token symbol
                <Help hint="What is Token Symbol?">
                  <strong>Token Symbol</strong> or ticker is a shortened name
                  (typically in capital letters) that refers to a token on a
                  trading platform. For example: HNY.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenSymbolChange}
                value={tokenSymbol}
                placeholder="MCT"
                wide
              />
            )}
          </Field>
        </div>
      </div>
      <Field
        label={
          <div
            css={`
              width: 100%;
              ${fieldsLayout}
            `}
          >
            <div>Seed token holders 🌱</div>
            <div>Balances</div>
          </div>
        }
      >
        <div ref={membersRef}>
          {members.map((member, index) => (
            <MemberField
              key={index}
              index={index}
              member={member}
              onRemove={removeMember}
              hideRemoveButton={hideRemoveButton}
              onUpdate={updateMember}
              displayStake
            />
          ))}
        </div>
        <Button
          icon={<IconPlus color={theme.accent} />}
          label="Add more"
          onClick={addMember}
        />
      </Field>
      <GnosisSafeField
        gnosisSafeAddress={gnosisSafeAddress}
        gnosisSafeChecked={gnosisSafeChecked}
        onGnosisSafeAddressChange={handleGnosisSafeAddressChange}
        onGnosisSafeCheckChange={handleGnosisSafeCheckChange}
      />
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

      <Info
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        Add seed token holders to define the initial token distribution. These
        settings will determine the name, symbol, and distribution of the token
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

function MemberField({
  index,
  member,
  hideRemoveButton,
  onUpdate,
  onRemove,
  displayStake,
}) {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const [account, stake] = member

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [onRemove, index])

  const handleAccountChange = useCallback(
    (event) => {
      onUpdate(index, event.target.value, stake)
    },
    [onUpdate, stake, index]
  )

  const handleStakeChange = useCallback(
    (event) => {
      const value = parseInt(event.target.value, 10)
      onUpdate(index, account, isNaN(value) ? -1 : value)
    },
    [onUpdate, account, index]
  )

  return (
    <div
      className="member"
      css={`
        ${fieldsLayout};
        position: relative;
        margin-bottom: ${1.5 * GU}px;
      `}
    >
      <div>
        <TextInput
          adornment={
            <span css="transform: translateY(1px)">
              {!hideRemoveButton && (
                <Button
                  display="icon"
                  icon={
                    <IconTrash
                      css={`
                        color: ${theme.negative};
                      `}
                    />
                  }
                  label="Remove"
                  onClick={handleRemove}
                  size="mini"
                />
              )}
            </span>
          }
          adornmentPosition="end"
          adornmentSettings={{ width: 52, padding: 8 }}
          onChange={handleAccountChange}
          placeholder="Ethereum address"
          value={account}
          wide
          css={`
            padding-left: ${4.5 * GU}px;
          `}
        />
        <div
          css={`
            position: absolute;
            top: ${1 * GU}px;
            left: ${1 * GU}px;
          `}
        >
          {isAddress(account) ? (
            <EthIdenticon address={account} radius={RADIUS} />
          ) : (
            <div
              css={`
                width: ${3 * GU}px;
                height: ${3 * GU}px;
                background: ${theme.disabled};
                border-radius: ${RADIUS}px;
              `}
            />
          )}
        </div>
      </div>
      <div>
        {displayStake && (
          <TextInput
            onChange={handleStakeChange}
            value={stake === -1 ? '' : stake}
            wide
          />
        )}
      </div>
    </div>
  )
}

MemberField.propTypes = {
  hideRemoveButton: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  member: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

export default TokenSettingsNative
