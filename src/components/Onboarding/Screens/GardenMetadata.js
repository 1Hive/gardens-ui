import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Field,
  GU,
  Help,
  IconPlus,
  IconTrash,
  Info,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import { Header } from '../kit'
import ImageUploader from '../../ImageUploader'
import Navigation from '../Navigation'

const COMMUNITY_LINK_TYPE = 'community'
const DOCUMENTATION_LINK_TYPE = 'documentation'

const GARDEN_LOGO_TYPE = 'logo_type'
const GARDEN_LOGO = 'logo'
const TOKEN_LOGO = 'token_logo'

const URL_REGEX = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
)

function GardenMetadata() {
  const { config, onBack, onConfigChange, onNext } = useOnboardingState()
  const [formData, setFormData] = useState(config.garden)
  const [displayErrors, setDisplayErrors] = useState(false)

  const handleGardenNameChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, name: value }))
  }, [])

  const handleGardenDescriptionChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, description: value }))
  }, [])

  const handleForumChange = useCallback(event => {
    const value = event.target.value
    setFormData(formData => ({ ...formData, forum: value }))
  }, [])

  const addLink = useCallback(
    type => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community: [
                ...formData.links.community,
                [{ link: '', label: '' }],
              ],
            }
          : {
              ...formData.links,
              documentation: [
                ...formData.links.documentation,
                [{ link: '', label: '' }],
              ],
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

  const removeLink = useCallback(
    (type, index) => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community:
                formData.links.community.length < 2
                  ? [{ link: '', label: '' }]
                  : formData.links.community.filter((_, i) => i !== index),
            }
          : {
              ...formData.links,
              documentation:
                formData.links.documentation.length < 2
                  ? [{ link: '', label: '' }]
                  : formData.links.documentation.filter((_, i) => i !== index),
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

  const updateLink = useCallback(
    (type, index, updatedUrl, updatedLabel) => {
      const linksObject =
        type === COMMUNITY_LINK_TYPE
          ? {
              ...formData.links,
              community: formData.links.community.map((link, i) =>
                i === index ? { link: updatedUrl, label: updatedLabel } : link
              ),
            }
          : {
              ...formData.links,
              documentation: formData.links.documentation.map((link, i) =>
                i === index ? { link: updatedUrl, label: updatedLabel } : link
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

  const handleOnAssetAdded = useCallback((type, base64, fileExtension) => {
    setFormData(formData => {
      return {
        ...formData,
        [type]: base64,
        [`${type}Extension`]: fileExtension,
      }
    })
  }, [])

  const handleOnGardenLogoTypeLoaded = useCallback(
    (base64, fileExtension) => {
      handleOnAssetAdded(GARDEN_LOGO_TYPE, base64, fileExtension)
    },
    [handleOnAssetAdded]
  )

  const handleOnGardenLogoLoaded = useCallback(
    (base64, fileExtension) => {
      handleOnAssetAdded(GARDEN_LOGO, base64, fileExtension)
    },
    [handleOnAssetAdded]
  )

  const handleOnTokenLogoLoaded = useCallback(
    (base64, fileExtension) => {
      handleOnAssetAdded(TOKEN_LOGO, base64, fileExtension)
    },
    [handleOnAssetAdded]
  )

  const handleOnAssetRemoved = useCallback(type => {
    setFormData(formData => {
      return {
        ...formData,
        [type]: '',
      }
    })
  }, [])

  const handleOnGardenLogoTypeRemoved = useCallback(() => {
    handleOnAssetRemoved(GARDEN_LOGO_TYPE)
  }, [handleOnAssetRemoved])

  const handleOnGardenLogoRemoved = useCallback(() => {
    handleOnAssetRemoved(GARDEN_LOGO)
  }, [handleOnAssetRemoved])

  const handleOnTokenLogoRemoved = useCallback(() => {
    handleOnAssetRemoved(TOKEN_LOGO)
  }, [handleOnAssetRemoved])

  const errors = useMemo(() => {
    const errors = []

    const { name, description, forum, links } = formData
    const { documentation, community } = links
    if (!name) {
      errors.push('Garden name not provided')
    }
    if (!description) {
      errors.push('Garden description not provided')
    }
    if (forum && !URL_REGEX.test(forum)) {
      errors.push('Forum is not in a valid url format')
    }

    documentation.map(doc => {
      if (doc.link && !URL_REGEX.test(doc.link)) {
        errors.push(`${doc.label} is not in a valid url format`)
      }
    })

    community.map(com => {
      if (com.link && !URL_REGEX.test(com.link)) {
        errors.push(`${com.label} is not in a valid url format`)
      }
    })

    return errors
  }, [formData])

  const handleNext = useCallback(() => {
    if (errors.length === 0) {
      onConfigChange('garden', formData)
      onNext()
    } else {
      setDisplayErrors(true)
    }
  }, [errors, onConfigChange, onNext, formData])

  const handleBack = useCallback(() => {
    onConfigChange('garden', formData)
    onBack()
  }, [onConfigChange, onBack, formData])

  return (
    <div>
      <Header
        title="Garden Metadata"
        subtitle="Fill with your garden information"
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: ${4 * GU}px;
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
            maxLength="15"
            onChange={handleGardenNameChange}
            value={formData.name}
            required
            css="width: 100%;"
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
            multiline
            maxLength="120"
            onChange={handleGardenDescriptionChange}
            value={formData.description}
            required
            css="width: 100%;"
          />
        </Field>
        <Box
          heading="Assets"
          css={`
            width: 100%;
            margin-bottom: ${3 * GU}px;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-around;
            `}
          >
            <Field label="Garden Logo Type">
              <Box
                css={`
                  text-align: center;
                  max-height: 143px;
                `}
              >
                <ImageUploader
                  id={1}
                  imageExist={formData.logo_type}
                  onImageLoaded={handleOnGardenLogoTypeLoaded}
                  onImageRemoved={handleOnGardenLogoTypeRemoved}
                />
              </Box>
            </Field>
            <Field label="Garden Logo">
              <Box
                css={`
                  text-align: center;
                `}
              >
                <ImageUploader
                  id={2}
                  imageExist={formData.logo}
                  onImageLoaded={handleOnGardenLogoLoaded}
                  onImageRemoved={handleOnGardenLogoRemoved}
                />
              </Box>
            </Field>
            <Field label="Token Icon">
              <Box
                css={`
                  text-align: center;
                `}
              >
                <ImageUploader
                  id={3}
                  imageExist={formData.token_logo}
                  onImageLoaded={handleOnTokenLogoLoaded}
                  onImageRemoved={handleOnTokenLogoRemoved}
                />
              </Box>
            </Field>
          </div>
        </Box>

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
                don't, the 1Hive forum will be assigned (add forum link) by
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
            onChange={handleForumChange}
            value={formData.forum}
            css="width: 100%;"
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

      {displayErrors && errors.length > 0 && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Info>
      )}

      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Next"
        onBack={handleBack}
        onNext={handleNext}
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
    (index, updatedUrl, updatedLabel) => {
      onUpdateLink(linksType, index, updatedUrl, updatedLabel)
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
                item={link}
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

function LinkField({ index, item, hideRemoveButton, onUpdate, onRemove }) {
  const theme = useTheme()

  const { link, label } = item

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
      onUpdate(index, link, value)
    },
    [onUpdate, link, index]
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
          placeholder="http://www.example.com"
          value={link}
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
