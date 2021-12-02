import React, { useCallback } from 'react'
import { Link, GU, useTheme } from '@1hive/1hive-ui'
import { useHistory } from 'react-router'

function MenuItem({ active, path, label, src, onClick = () => {} }) {
  const history = useHistory()
  const theme = useTheme()

  const handleClickItem = useCallback(
    path => {
      history.push(path)
      onClick()
    },
    [history, onClick]
  )
  return (
    <li
      css={`
        position: relative;
        background: ${active ? 'rgb(212 251 216)' : theme.surface};
        height: ${8.5 * GU}px;
        width: 100%;
        ${label &&
          ` &:hover:after {
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
          `}
          onClick={() => handleClickItem(path)}
        >
          <img
            src={src}
            height={48}
            width={48}
            alt=""
            css={`
              display: block;
              border: 2px solid ${theme.surface};
              border-radius: 50%;
            `}
          />
        </Link>
      </div>
    </li>
  )
}

export default MenuItem
