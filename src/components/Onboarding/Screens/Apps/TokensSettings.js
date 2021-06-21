import React, { useCallback, useEffect, useState, useRef } from 'react'
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
import Navigation from '../../Navigation'
import { useOnboardingState } from '../../../../providers/Onboarding'
import Header from '../../Header/Header'
import KnownAppBadge from '../../KnownAppBadge'

function useFieldsLayout() {
  // In its own hook to be adapted for smaller views
  return `
    display: grid;
    grid-template-columns: auto ${12 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}

function validateDuplicateAddresses(members) {
  const validAddresses = members
    .map(([address]) => address.toLowerCase())
    .filter(address => isAddress(address))

  return validAddresses.length === new Set(validAddresses).size
}

function validationError(tokenName, tokenSymbol, members, commonPool) {
  if (!members.some(([address]) => isAddress(address))) {
    return 'You need at least one valid address.'
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
  if (!commonPool) {
    return 'Please add a Initial Common Pool amount.'
  }
  return null
}

function TokensSettings() {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const { onBack, onNext } = useOnboardingState()

  const [formError, setFormError] = useState()

  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [commonPool, setCommonPool] = useState(0)
  const [accountStake] = useState(0)

  const [members, setMembers] = useState([['', accountStake]])

  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const handleCommonPoolChange = useCallback(event => {
    setFormError(null)
    setCommonPool(event.target.value)
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
    setMembers(members => [...members, ['', accountStake]])
    focusLastMember()
  }, [accountStake, focusLastMember])

  const removeMember = useCallback(
    index => {
      setFormError(null)
      setMembers(members =>
        members.length < 2
          ? // When the remove button of the last field
            // gets clicked, we only empty the field.
            [['', accountStake]]
          : members.filter((_, i) => i !== index)
      )
      focusLastMember()
    },
    [accountStake, focusLastMember]
  )

  const updateMember = useCallback((index, updatedAccount, updatedStake) => {
    setFormError(null)
    setMembers(members =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(tokenName, tokenSymbol, members, commonPool)
      setFormError(error)
      if (!error) {
        const screenData = {
          tokenName,
          tokenSymbol,
          members: members.filter(
            ([account, stake]) => isAddress(account) && stake > 0
          ),
          commonPool,
        }
        const mergedData = { ...screenData }
        onNext(mergedData)
      }
    },
    [members, onNext, tokenName, tokenSymbol, commonPool]
  )

  // Focus the token name as soon as it becomes available
  const handleTokenNameRef = useCallback(element => {
    if (element) {
      element.focus()
    }
  }, [])

  const hideRemoveButton = members.length < 2 && !members[0]

  const disableNext =
    !tokenName ||
    !tokenSymbol ||
    members.every(([account, stake]) => !account || stake < 0) ||
    !commonPool

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
          subtitle={
            <span
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              Choose your
              <span
                css={`
                  display: flex;
                  margin: 0 ${1.5 * GU}px;
                `}
              >
                <KnownAppBadge
                  appName="token-manager.aragonpm.eth"
                  label="Tokens"
                />
              </span>
              settings below.
            </span>
          }
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
                  token that will be minted when creating this organization.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                ref={handleTokenNameRef}
                id={id}
                onChange={handleTokenNameChange}
                placeholder="My Organization Token"
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
                  on a trading platform. For example: ANT.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenSymbolChange}
                value={tokenSymbol}
                placeholder="MOT"
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
            <div>Seed holders</div>
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
      <Field
        label={
          <React.Fragment>
            Initial Common Pool
            <Help hint="What is the Initial Common Pool amount">
              This is the shared resource of the community which will be managed
              by the token holders using Conviction Voting
            </Help>
          </React.Fragment>
        }
      >
        {({ id }) => (
          <TextInput
            ref={handleTokenNameRef}
            id={id}
            onChange={handleCommonPoolChange}
            placeholder="Initial Common Pool"
            value={commonPool}
          />
        )}
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
        be created for your organization. ' Add members to define the initial
        distribution of this token.' Set the initial Common Pool.
      </Info>

      <Navigation
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={`Next: `}
        onBack={onBack}
        onNext={handleSubmit}
      />
    </form>
  )
}

TokensSettings.propTypes = {}

TokensSettings.defaultProps = {
  accountStake: -1,
  title: 'Configure template',
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

function formatReviewFields(screenData) {
  return [
    [
      'Token name & symbol',
      `${screenData.tokenName} (${screenData.tokenSymbol})`,
    ],
    ...screenData.members.map(([account, amount], i) => [
      `Tokenholder #${i + 1}`,
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          {amount} {screenData.tokenSymbol}
        </span>
      </div>,
    ]),
    [`Initial Common Pool`, `${screenData.commonPool}`],
  ]
}

TokensSettings.formatReviewFields = formatReviewFields
export default TokensSettings
