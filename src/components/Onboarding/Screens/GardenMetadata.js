import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Field,
  GU,
  IconPlus,
  IconTrash,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import ImageUploader from '../../ImageUploader'
import Navigation from '../Navigation'
import { commitNewDao } from '../../../services/gihub'

const DEFAULT_FORM_DATA = {
  gardenName: '',
  gardenDescription: '',
  forum: '',
  links: [],
}

function GardenMetadata() {
  const { onBack, onNext } = useOnboardingState()
  const theme = useTheme()
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const [focusLastMemberNext, setFocusLastMemberNext] = useState(false)

  const linksRef = useRef()
  const [links, setLinks] = useState(
    formData.links && formData.links.length > 0 ? formData.links : [['', '']]
  )

  useEffect(() => {
    if (!focusLastMemberNext || !linksRef.current) {
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
    const elts = linksRef.current.querySelectorAll('.links')
    if (elts.length > 0) {
      elts[elts.length - 1].querySelector('input').focus()
    }
  }, [focusLastMemberNext])

  const handleGardenNameChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, gardenName: value }))
  }, [])

  const handleGardenDescriptionChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, gardenDescription: value }))
  }, [])

  const hideRemoveButton = links.length < 2 && !links[0]

  const focusLastMember = useCallback(() => {
    setFocusLastMemberNext(true)
  }, [])

  const addMember = useCallback(() => {
    setLinks(members => [...members, ['', '']])
    focusLastMember()
  }, [focusLastMember])

  const removeMember = useCallback(
    index => {
      setLinks(members =>
        members.length < 2
          ? // When the remove button of the last field
            // gets clicked, we only empty the field.
            [['', '']]
          : members.filter((_, i) => i !== index)
      )
      focusLastMember()
    },
    [focusLastMember]
  )

  const updateMember = useCallback((index, updatedAccount, updatedStake) => {
    setLinks(members =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  return (
    <div>
      <div
        css={`
          margin-bottom: ${6 * GU}px;
          text-align: center;
        `}
      >
        <h1
          css={`
            ${textStyle('title1')};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Garden Metadata
        </h1>
        <div>
          <p
            css={`
              ${textStyle('body1')};
              color: ${theme.contentSecondary};
            `}
          >
            Fill with your garden information
          </p>
        </div>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: ${6 * GU}px;
        `}
      >
        <Field
          label="Garden Name"
          css={`
            width: 100%;
            marging-bottom: ${2 * GU}px;
          `}
        >
          <TextInput
            css="width: 100%;"
            onChange={handleGardenNameChange}
            value={formData.gardenName}
            required
          />
        </Field>
        <Field
          label="Garden Description"
          css={`
            width: 100%;
            marging-bottom: ${2 * GU}px;
          `}
        >
          <TextInput
            css="width: 100%;"
            onChange={handleGardenDescriptionChange}
            value={formData.gardenDescription}
            required
          />
        </Field>
        <Field
          label="Assets"
          css={`
            width: 100%;
          `}
        >
          <Box
            css={`
              width: 100%;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-around;
              `}
            >
              <Field label="Dao Logo">
                <Box
                  css={`
                    text-align: center;
                  `}
                >
                  <ImageUploader />
                </Box>
              </Field>
              <Field label="Dao Logo mobile">
                <Box
                  css={`
                    text-align: center;
                  `}
                >
                  <ImageUploader />
                </Box>
              </Field>
              <Field label="Token Icon">
                <Box
                  css={`
                    text-align: center;
                  `}
                >
                  <ImageUploader />
                </Box>
              </Field>
            </div>
          </Box>
        </Field>
        <Field
          label="Forum"
          css={`
            width: 100%;
            marging-bottom: ${2 * GU}px;
          `}
        >
          <TextInput
            css="width: 100%;"
            onChange={handleGardenNameChange}
            value={formData.gardenName}
            required
          />
        </Field>
        <Field
          label="Community Links"
          css={`
            width: 100%;
          `}
        >
          <Box
            css={`
              width: 100%;
            `}
          >
            <Field
              label={
                <div
                  css={`
                    width: 100%;
                    display: grid;
                    grid-template-columns: auto ${18 * GU}px;
                    grid-column-gap: ${1.5 * GU}px;
                    ${textStyle('body3')};
                  `}
                >
                  <div>Link</div>
                  <div>Label</div>
                </div>
              }
              css={`
                width: 100%;
              `}
            >
              <div ref={linksRef}>
                {links.map((member, index) => (
                  <LinkField
                    key={index}
                    index={index}
                    member={member}
                    onRemove={removeMember}
                    hideRemoveButton={hideRemoveButton}
                    onUpdate={updateMember}
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
          </Box>
        </Field>
      </div>

      <Button onClick={commitNewDao}> TEST </Button>
      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Next:"
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

function LinkField({ index, member, hideRemoveButton, onUpdate, onRemove }) {
  const theme = useTheme()

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
      className="links"
      css={`
        display: grid;
        grid-template-columns: auto ${18 * GU}px;
        grid-column-gap: ${1.5 * GU}px;
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
          placeholder="Link URL"
          value={account}
          wide
          css={`
            padding-left: ${2 * GU}px;
          `}
        />
      </div>
      <div>
        <TextInput
          onChange={handleStakeChange}
          value={stake === -1 ? '' : stake}
          wide
        />
      </div>
    </div>
  )
}

export default GardenMetadata
