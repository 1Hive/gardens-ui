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
import { publishNewDao } from '../../../services/github'

const COMMUNITY_LINK_TYPE = 'community'
const DOCUMENTATION_LINK_TYPE = 'documentation'

const DAO_LOGO = 'logo_type'
const DAO_LOGO_MOBILE = 'logo'
const TOKEN_LOGO = 'token_logo'

function GardenMetadata() {
  const { config, onBack, onConfigChange, onNext } = useOnboardingState()
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

  const handleOnDaoLogoLoaded = useCallback(
    (base64, fileExtension) => {
      handleOnAssetAdded(DAO_LOGO, base64, fileExtension)
    },
    [handleOnAssetAdded]
  )

  const handleOnMobileLogoLoaded = useCallback(
    (base64, fileExtension) => {
      handleOnAssetAdded(DAO_LOGO_MOBILE, base64, fileExtension)
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

  const handleOnDaoLogoRemoved = useCallback(() => {
    handleOnAssetRemoved(DAO_LOGO)
  }, [handleOnAssetRemoved])

  const handleOnMobileLogoRemoved = useCallback(() => {
    handleOnAssetRemoved(DAO_LOGO_MOBILE)
  }, [handleOnAssetRemoved])

  const handleOnTokenLogoRemoved = useCallback(() => {
    handleOnAssetRemoved(TOKEN_LOGO)
  }, [handleOnAssetRemoved])

  const handleNext = useCallback(() => {
    onConfigChange('garden', formData)
    onNext()
  }, [onConfigChange, onNext, formData])

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
            maxLength="15"
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
            multiline
            maxLength="120"
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
                    max-height: 143px;
                  `}
                >
                  <ImageUploader
                    id={1}
                    onImageLoaded={handleOnDaoLogoLoaded}
                    onImageRemoved={handleOnDaoLogoRemoved}
                  />
                </Box>
              </Field>
              <Field label="Dao Logo mobile">
                <Box
                  css={`
                    text-align: center;
                  `}
                >
                  <ImageUploader
                    id={2}
                    onImageLoaded={handleOnMobileLogoLoaded}
                    onImageRemoved={handleOnMobileLogoRemoved}
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
                    onImageLoaded={handleOnTokenLogoLoaded}
                    onImageRemoved={handleOnTokenLogoRemoved}
                  />
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
            onChange={handleForumChange}
            value={formData.forum}
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

      <Button onClick={() => publishNewDao(formData)}> TEST </Button>
      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Next"
        onBack={onBack}
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
          placeholder="Link URL"
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
