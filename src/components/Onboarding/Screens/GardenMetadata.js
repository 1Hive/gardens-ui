import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Field,
  GU,
  Help,
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

const COMMUNITY_LINK_TYPE = 'community'
const DOCUMENTATION_LINK_TYPE = 'documentation'

function GardenMetadata() {
  const { config, onBack, onNext } = useOnboardingState()
  const theme = useTheme()
  const [formData, setFormData] = useState(config.garden)

  const handleGardenNameChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, name: value }))
  }, [])

  const handleGardenDescriptionChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, description: value }))
  }, [])

  const addLink = useCallback(
    type => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community: [...formData.links.community, ['', '']],
            }
          : {
              ...formData.links,
              documentation: [...formData.links.documentation, ['', '']],
            }
      setFormData(formData => {
        return {
          ...formData,
          links: linksObject,
        }
      })
      // focusLastLink()
    },
    [formData.links]
  )

  console.log('formData ', formData)

  const removeLink = useCallback(
    (type, index) => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community:
                formData.links.community.length < 2
                  ? [['', '']]
                  : formData.links.community.filter((_, i) => i !== index),
            }
          : {
              ...formData.links,
              documentation:
                formData.links.documentation.length < 2
                  ? [['', '']]
                  : formData.links.documentation.filter((_, i) => i !== index),
            }

      setFormData(formData => {
        return {
          ...formData,
          links: linksObject,
        }
      })
      // focusLastLink()
    },
    [formData.links]
  )

  const updateLink = useCallback(
    (type, index, updatedAccount, updatedStake) => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community: formData.links.community.map((member, i) =>
                i === index ? [updatedAccount, updatedStake] : member
              ),
            }
          : {
              ...formData.links,
              documentation: formData.links.documentation.map((member, i) =>
                i === index ? [updatedAccount, updatedStake] : member
              ),
            }

      setFormData(formData => {
        return {
          ...formData,
          links: linksObject,
        }
      })
    },
    [formData.links]
  )

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
            value={formData.name}
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
            value={formData.description}
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
          label={
            <div
              css={`
                display: flex;
                align-items: center;
                width: 100%;
              `}
            >
              <p
                css={`
                  ${textStyle('body4')};
                  font-weight: 600;
                `}
              >
                Forum
              </p>
              <Help>
                Add a link to your discussion platform - the best way to do this
                is to create a discourse (add link to discourse site). If you
                don't,the 1Hive forum will be assigned (add forum link) by
                default.
              </Help>
            </div>
          }
          css={`
            width: 100%;
            marging-bottom: ${2 * GU}px;
          `}
        >
          <TextInput
            css="width: 100%;"
            onChange={handleGardenNameChange}
            value={formData.name}
          />
        </Field>
        <LinksBox
          fieldTitle="Community Links"
          linksType={COMMUNITY_LINK_TYPE}
          links={formData.links.community}
          onAddLink={addLink}
          onRemoveLink={removeLink}
          onUpdateLink={updateLink}
        />
        <LinksBox
          fieldTitle="Documentation Links"
          linksType={DOCUMENTATION_LINK_TYPE}
          links={formData.links.documentation}
          onAddLink={addLink}
          onRemoveLink={removeLink}
          onUpdateLink={updateLink}
        />
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

function LinksBox({
  fieldTitle,
  linksType,
  links,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}) {
  const [focusLastLinkNext, setFocusLastLinkNext] = useState(false)
  const linksRef = useRef()
  const theme = useTheme()

  const focusLastLink = useCallback(() => {
    setFocusLastLinkNext(true)
  }, [])

  const handleAddLink = useCallback(() => {
    onAddLink(linksType)
    focusLastLink()
  }, [focusLastLink, linksType, onAddLink])

  const handleUpdateLink = useCallback(
    (index, updatedAccount, updatedStake) => {
      onUpdateLink(linksType, index, updatedAccount, updatedStake)
    },
    [linksType, onUpdateLink]
  )

  const handleRemoveLink = useCallback(
    index => {
      onRemoveLink(linksType, index)
      focusLastLink()
    },
    [focusLastLink, linksType, onRemoveLink]
  )

  const hideRemoveButton = links.length < 2 && !links[0]

  useEffect(() => {
    if (!focusLastLinkNext || !linksRef.current) {
      return
    }

    setFocusLastLinkNext(false)

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
  }, [focusLastLinkNext])

  return (
    <Field
      label={fieldTitle}
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
            {links.map((link, index) => (
              <LinkField
                key={index}
                index={index}
                link={link}
                onRemove={handleRemoveLink}
                hideRemoveButton={hideRemoveButton}
                onUpdate={handleUpdateLink}
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
            onClick={handleAddLink}
            disabled={links.length === 5}
          />
        </Field>
      </Box>
    </Field>
  )
}

function LinkField({ index, link, hideRemoveButton, onUpdate, onRemove }) {
  const theme = useTheme()

  const [url, label] = link

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [onRemove, index])

  const handleUrlChange = useCallback(
    event => {
      onUpdate(index, event.target.value, label)
    },
    [onUpdate, label, index]
  )

  const handleLabelChange = useCallback(
    event => {
      const value = event.target.value
      onUpdate(index, url, value)
    },
    [onUpdate, url, index]
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
          onChange={handleUrlChange}
          placeholder="Link URL"
          value={url}
          wide
          css={`
            padding-left: ${2 * GU}px;
          `}
        />
      </div>
      <div>
        <TextInput onChange={handleLabelChange} value={label} wide />
      </div>
    </div>
  )
}

export default GardenMetadata
