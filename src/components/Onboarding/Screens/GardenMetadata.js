import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Help,
  IconPlus,
  IconTrash,
  Info,
  Link,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { FileUploaderField, Header } from '../kit'
import Navigation from '../Navigation'
import { useOnboardingState } from '@providers/Onboarding'

import LinksTooltipImg from '@assets/linksTooltip.svg'

const COMMUNITY_LINK_TYPE = 'community'
const DOCUMENTATION_LINK_TYPE = 'documentation'

const GARDEN_LOGO_TYPE = 'logo_type'
const GARDEN_LOGO = 'logo'
const TOKEN_LOGO = 'token_logo'

const DEFAULT_FORUM_LINK = 'https://forum.1hive.org'

const URL_REGEX = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
)

function GardenMetadata() {
  const theme = useTheme()
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    steps,
    step,
  } = useOnboardingState()
  const [formData, setFormData] = useState(config.garden)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [formatValidationColor, setFormatValidationColor] = useState(
    theme.contentSecondary
  )

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

  const handleOnAssetUpdated = useCallback((type, file) => {
    setFormData(formData => {
      return {
        ...formData,
        [type]: file
          ? {
              ...file,
              base64: btoa(file.content),
              imageExtension: file.blob.type.split('/')[1],
            }
          : '',
      }
    })
  }, [])

  const handleOnGardenLogoTypeUpdated = useCallback(
    file => {
      handleOnAssetUpdated(GARDEN_LOGO_TYPE, file)
    },
    [handleOnAssetUpdated]
  )

  const handleOnGardenLogoUpdated = useCallback(
    file => {
      handleOnAssetUpdated(GARDEN_LOGO, file)
    },
    [handleOnAssetUpdated]
  )

  const handleOnTokenLogoUpdated = useCallback(
    file => {
      handleOnAssetUpdated(TOKEN_LOGO, file)
    },
    [handleOnAssetUpdated]
  )

  const errors = useMemo(() => {
    const errors = []

    const { name, description, forum, links } = formData
    const { documentation, community } = links
    if (!name) {
      errors.push('Garden name not provided.')
    }
    if (!description) {
      errors.push('Garden description not provided.')
    }
    if (forum && !URL_REGEX.test(forum)) {
      errors.push('Forum is not in a valid url format.')
    }

    documentation.map(doc => {
      if (doc.link && !URL_REGEX.test(doc.link)) {
        errors.push(`${doc.label} is not in a valid url format.`)
      }
    })

    community.map(com => {
      if (com.link && !URL_REGEX.test(com.link)) {
        errors.push(`${com.label} is not in a valid url format.`)
      }
    })

    return errors
  }, [formData])

  const handleNext = useCallback(() => {
    if (errors.length === 0) {
      onConfigChange('garden', {
        ...formData,
        forum: formData.forum || DEFAULT_FORUM_LINK,
      })
      onNext()
    } else {
      setDisplayErrors(true)
    }
  }, [errors, onConfigChange, onNext, formData])

  const handleOnDragAccepted = useCallback(() => {
    setFormatValidationColor(theme.contentSecondary)
  }, [theme])
  const handleOnDragRejected = useCallback(() => {
    setFormatValidationColor(theme.error)
  }, [theme])

  const ForumTooltip = (
    <div>
      Add the URL to your discussion platform - we recommend{' '}
      <Link href="https://www.discourse.org">discourse</Link>. If you don't, the{' '}
      <Link href="https://forum.1hive.org">1Hive forum</Link> will be assigned
      by default.
    </div>
  )

  return (
    <div>
      <Header
        title="Add Profile"
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
        <MetadataField label="GARDEN NAME">
          <TextInput
            maxLength="15"
            onChange={handleGardenNameChange}
            value={formData.name}
            css="width: 100%;"
          />
        </MetadataField>
        <MetadataField label="GARDEN DESCRIPTION">
          <TextInput
            multiline
            maxLength="120"
            onChange={handleGardenDescriptionChange}
            value={formData.description}
            css="width: 100%;"
          />
        </MetadataField>
        <MetadataField label="FORUM" optional tooltip={ForumTooltip}>
          <TextInput
            onChange={handleForumChange}
            value={formData.forum}
            css="width: 100%;"
          />
        </MetadataField>

        <MetadataField
          optional
          label="ASSETS"
          tooltip="If you don’t have this images yet, you will get default ones
                assigned in the meantime."
        >
          <div>
            <div
              css={`
                display: flex;
                flex-direction: column;
                ${textStyle('body2')};
                color: ${theme.contentSecondary};
              `}
            >
              <span>Drag and drop or browse your files to upload one.</span>
              <span
                css={`
                  color: ${formatValidationColor};
                  font-weight: 600;
                  margin-top: ${1 * GU}px;
                `}
              >
                Valid file formats are: JPG and PNG
              </span>
            </div>
            <div
              css={`
                margin-top: ${2 * GU}px;
                display: flex;
              `}
            >
              <div
                css={`
                  width: 100%;
                  margin-right: ${1.5 * GU}px;
                `}
              >
                <FileUploaderField
                  allowedMIMETypes={['image/jpeg', 'image/png']}
                  file={formData.logo_type}
                  onDragAccepted={handleOnDragAccepted}
                  onDragRejected={handleOnDragRejected}
                  onFileUpdated={handleOnGardenLogoTypeUpdated}
                  label="HEADER LOGO"
                />
              </div>
              <div
                css={`
                  width: 100%;
                  margin-right: ${1.5 * GU}px;
                `}
              >
                <FileUploaderField
                  allowedMIMETypes={['image/jpeg', 'image/png']}
                  file={formData.logo}
                  onDragAccepted={handleOnDragAccepted}
                  onDragRejected={handleOnDragRejected}
                  onFileUpdated={handleOnGardenLogoUpdated}
                  label="GARDEN LOGO"
                />
              </div>
              <div
                css={`
                  width: 100%;
                `}
              >
                <FileUploaderField
                  allowedMIMETypes={['image/jpeg', 'image/png']}
                  file={formData.token_logo}
                  onDragAccepted={handleOnDragAccepted}
                  onDragRejected={handleOnDragRejected}
                  onFileUpdated={handleOnTokenLogoUpdated}
                  label="TOKEN ICON"
                />
              </div>
            </div>
          </div>
        </MetadataField>
        <LinksBox
          fieldTitle="COMMUNITY LINKS"
          linksType={COMMUNITY_LINK_TYPE}
          links={formData.links.community}
          onAddLink={addLink}
          onRemoveLink={removeLink}
          onUpdateLink={updateLink}
        />
        <LinksBox
          fieldTitle="DOCUMENTATION LINKS"
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
        nextLabel={`Next: ${steps[step + 1].title}`}
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

  const ImageTooltip = (
    <div
      css={`
        width: 100%;
      `}
    >
      <h3
        css={`
          ${textStyle('body3')};
          color: ${theme.contentSecondary};
        `}
      >
        This links will be displayed at the footer of your Garden
      </h3>
      <img
        css={`
          width: 100%;
        `}
        alt=""
        src={LinksTooltipImg}
      />
    </div>
  )

  return (
    <MetadataField optional label={fieldTitle} tooltip={ImageTooltip}>
      <div
        css={`
          width: 100%;
          margin-top: ${2 * GU}px;
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
      </div>
    </MetadataField>
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

function MetadataField({ children, label, optional, tooltip }) {
  const theme = useTheme()
  return (
    <div
      css={`
        width: 100%;
        margin-top: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
            margin-right: ${0.5 * GU}px;
          `}
        >
          {label} {optional && ' (optional)'}
        </span>
        {tooltip && <Help>{tooltip}</Help>}
      </div>
      <div
        css={`
          width: 100%;
          margin-top: ${1 * GU}px;
        `}
      >
        {children}
      </div>
    </div>
  )
}
export default GardenMetadata
