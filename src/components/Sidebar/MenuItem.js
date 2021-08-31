import React from 'react'
import { Link, GU, useTheme } from '@1hive/1hive-ui'

function MenuItem({ active, path, name, src, onOpen }) {
  const theme = useTheme()

  return (
    <li
      css={`
        position: relative;
        background: ${active ? 'rgb(249, 249, 248)' : theme.surface};
        height: ${8.5 * GU}px;
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
            background: rgb(141, 233, 149);
          `}
        />
      )}
      <div
        css={`
          display: flex;
          padding: ${1.5 * GU}px;
        `}
      >
        <Link
          external={false}
          href={path}
          css={`
            display: block;
          `}
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
