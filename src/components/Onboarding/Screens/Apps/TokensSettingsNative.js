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
  isAddress,
  RADIUS,
  TextInput,
  useTheme,
} from '@1hive/1hive-ui'
import Navigation from '../../Navigation'
import { useOnboardingState } from '@providers/Onboarding'
import Header from '../../kit/Header'

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
    .filter(address => isAddress(address))

  return validAddresses.length === new Set(validAddresses).size
}

function validationError(tokenName, tokenSymbol, members) {
  if (members.some(([address]) => !isAddress(address))) {
    return 'Every address you provide should be a valid address.'
  }
  if (members.some(([account, stake]) => !(stake > 0))) {
    return 'Every account has to have a positive balance.'
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
  return null
}

function TokensSettingsNative() {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const {
    config,
    onBack,
    onNext,
    steps,
    step,
    onConfigChange,
  } = useOnboardingState()

  const [formError, setFormError] = useState()

  const [tokenName, setTokenName] = useState(config.tokens.name)
  const [tokenSymbol, setTokenSymbol] = useState(config.tokens.symbol)

  const [members, setMembers] = useState(
    config.tokens.holders.length === 0 ? [['', 0]] : config.tokens.holders
  )

  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
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
    setMembers(members => [...members, ['', 0]])
    focusLastMember()
  }, [focusLastMember])

  const removeMember = useCallback(
    index => {
      setFormError(null)
      setMembers(members =>
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
    setMembers(members =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  const handleNext = useCallback(
    event => {
      event.preventDefault()

      const error = validationError(tokenName, tokenSymbol, members)
      setFormError(error)

      if (!error) {
        onConfigChange('tokens', {
          name: tokenName,
          symbol: tokenSymbol,
          holders: members,
        })
        onNext()
      }
    },
    [members, onNext, tokenName, tokenSymbol, onConfigChange]
  )

  const hideRemoveButton = members.length < 2 && !members[0]

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div>
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
                  (typically in capital letters) that refers to a token or coin
                  on a trading platform. For example: HNY.
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
            <div>Seed holders 🌱</div>
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
          icon={
            <IconPlus
              css={`
                color: ${theme.accent};
              `}
            />
          }
          label="Add more"
          onClick={addMember}
        />
      </Field>
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
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings will determine the name and symbol of the token that will
        be created for your community. Add seed members to define the initial
        distribution of this token.
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
    event => {
      onUpdate(index, event.target.value, stake)
    },
    [onUpdate, stake, index]
  )

  const handleStakeChange = useCallback(
    event => {
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

export default TokensSettingsNative
