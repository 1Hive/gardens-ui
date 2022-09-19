import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { GU, Link, useTheme } from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'

const BaseItem = ({
  active,
  children,
  height,
  path,
  label,
  onClick = () => {},
}) => {
  const theme = useTheme()
  const router = useRouter()
  const AppTheme = useAppTheme()

  const activeColor =
    AppTheme.appearance === 'light' ? 'rgb(212 251 216)' : theme.positiveSurface

  const handleClickItem = useCallback(() => {
    if (path) {
      router.push(path)
    }
    onClick()
  }, [router, onClick, path])

  return (
    <li
      css={`
        position: relative;
        background: ${active ? activeColor : theme.surface};
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
            background: ${AppTheme.appearance === 'light'
              ? 'rgb(62, 207, 75)'
              : theme.positive};
          `}
        />
      )}
      <Link
        external={false}
        onClick={handleClickItem}
        css={`
          display: block;
          width: 100%;
          color: inherit;
        `}
      >
        <div
          css={`
            display: flex;
            padding: ${1.5 * GU}px;
            ${!active &&
            `&:hover {
              background: ${
                AppTheme.appearance === 'light'
                  ? 'rgb(246, 246, 247)'
                  : theme.accentContent
              };
                background: ;
              }`}
          `}
        >
          {children}
        </div>
      </Link>
    </li>
  )
}

export default BaseItem
