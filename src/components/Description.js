import React from 'react'
import { GU, IdentityBadge, useTheme } from '@1hive/1hive-ui'

function Description({ disableBadgeInteraction, path, ...props }) {
  return (
    <span
      css={`
        // overflow-wrap:anywhere and hyphens:auto are not supported yet by
        // the latest versions of Safari (as of June 2020), which
        // is why word-break:break-word has been added here.
        hyphens: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
      `}
      {...props}
    >
      {path
        ? path.map((step, index) => (
            <DescriptionStep
              disableBadgeInteraction={disableBadgeInteraction}
              key={index}
              step={step}
            />
          ))
        : ''}
    </span>
  )
}

/* eslint-disable react/prop-types */
function DescriptionStep({ step, disableBadgeInteraction }) {
  const theme = useTheme()

  const description = []

  if (step.annotatedDescription) {
    description.push(
      step.annotatedDescription.map(({ type, value }, index) => {
        const key = index + 1

        if (type === 'address' || type === 'any-account') {
          return (
            <span key={key}>
              {' '}
              <IdentityBadge
                badgeOnly={disableBadgeInteraction}
                compact
                entity={type === 'any-account' ? 'Any account' : value}
              />
            </span>
          )
        }

        if (type === 'role' || type === 'kernelNamespace' || type === 'app') {
          return <span key={key}> “{value.name}”</span>
        }

        if (type === 'apmPackage') {
          return <span key={key}> “{value.artifact.appName}”</span>
        }

        return <span key={key}> {value.description || value}</span>
      })
    )
  } else {
    description.push(
      <span key={description.length + 1}>
        {step.description || 'No description'}
      </span>
    )
  }

  description.push(<br key={description.length + 1} />)

  const childrenDescriptions = (step.children || []).map((child, index) => {
    return <DescriptionStep step={child} key={index} />
  })

  return (
    <>
      <span>{description}</span>
      {childrenDescriptions.length > 0 && (
        <ul
          css={`
            list-style-type: none;
            margin-left: 0;
            padding-left: ${0.5 * GU}px;
            text-indent: -${0.5 * GU}px;
          `}
        >
          <li
            css={`
              padding-left: ${2 * GU}px;
              &:before {
                content: '';
                width: ${0.5 * GU}px;
                height: ${0.5 * GU}px;
                background: ${theme.accent};
                border-radius: 50%;
                display: inline-block;
              }
              span {
                display: inline;
                color: ${theme.surfaceContentSecondary};
              }
            `}
          >
            {childrenDescriptions}
          </li>
        </ul>
      )}
    </>
  )
}

export default Description
