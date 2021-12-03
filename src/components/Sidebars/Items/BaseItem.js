import { GU, Link, useTheme } from '@1hive/1hive-ui'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

const BaseItem = ({
  active,
  children,
  height,
  path,
  label,
  onClick = () => {},
}) => {
  const theme = useTheme()
  const history = useHistory()

  const handleClickItem = useCallback(
    path => {
      if (path) {
        history.push(path)
      }
      onClick()
    },
    [history, onClick]
  )

  return (
    <li
      css={`
        position: relative;
        background: ${active ? 'rgb(212 251 216)' : theme.surface};
        height: ${height}px;
        width: 100%;
        border-right: 1px solid ${theme.border};
        ${label &&
          ` &:hover:after {
            max-width: ${27 * GU}px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: absolute;
            content: "${label}";
            background: rgba(44, 52, 55, 0.8);
            border-radius: 12px;
            color: white;
            padding: ${0.5 * GU}px ${2 * GU}px;
            top: calc(50% - 16px);
            left: 80px;
        }
      `}
      `}
    >
      {active && (
        <div
          css={`
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 4px;
            background: rgb(62, 207, 75);
          `}
        />
      )}
      <div
        css={`
          display: flex;
          padding: ${1.5 * GU}px;
          ${!active &&
            `&:hover {
            background: rgb(246, 246, 247);
          }`}
        `}
      >
        <Link
          external={false}
          css={`
            display: block;
            color: inherit;
          `}
          onClick={() => handleClickItem(path)}
        >
          {children}
        </Link>
      </div>
    </li>
  )
}

export default BaseItem
