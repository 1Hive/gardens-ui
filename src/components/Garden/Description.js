import React from 'react'
import { GU, Tag, useTheme } from '@1hive/1hive-ui'
import GardenAppBadge from './GardenAppBadge'
import IdentityBadge from '@components/IdentityBadge'

function Description({ disableBadgeInteraction, path, ...props }) {
  return (
    <span>
      {path
        ? path.map((step, index) => (
            <DescriptionStep
              disableBadgeInteraction={disableBadgeInteraction}
              key={index}
              step={step}
              {...props}
            />
          ))
        : 'No description'}
    </span>
  )
}

/* eslint-disable react/prop-types */
function DescriptionStep({
  step,
  disableBadgeInteraction,
  dotIndicator = true,
  ...props
}) {
  const theme = useTheme()

  const description = []

  if (step.annotatedDescription) {
    description.push(
      step.annotatedDescription.map(({ type, value }, index) => {
        const key = index + 1

        if (type === 'address' || type === 'any-account') {
          return (
            <span key={key}>
              <IdentityBadge
                badgeOnly={disableBadgeInteraction}
                compact
                entity={type === 'any-account' ? 'Any account' : value}
              />
            </span>
          )
        }

        if (type === 'app') {
          return (
            <span key={key}>
              <GardenAppBadge app={value} />
            </span>
          )
        }

        if (type === 'role' || type === 'kernelNamespace') {
          return (
            <Tag key={key} color="#000">
              {value.name}
            </Tag>
          )
        }

        if (type === 'apmPackage') {
          return <span key={key}> “{value.artifact.appName}”</span>
        }

        return (
          <span
            key={key}
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          >
            {value.description || value}
          </span>
        )
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
    <div
      {...props}
      css={`
        margin-bottom: ${1 * GU}px;
        display: flex;
        align-items: flex-start;
      `}
    >
      {dotIndicator && (
        <div
          css={`
            height: 6px;
            flex-basis: 6px;
            flex-grow: 0;
            flex-shrink: 0;
            background-color: ${theme.accent};
            margin-top: ${1 * GU}px;
            margin-right: ${1 * GU}px;
          `}
        />
      )}
      <div>
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
      </div>
    </div>
  )
}

export default Description
