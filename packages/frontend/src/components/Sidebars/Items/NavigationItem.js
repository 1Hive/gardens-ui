import { GU, useTheme } from '@1hive/1hive-ui'
import React from 'react'
import BaseItem from './BaseItem'

const NavigationItem = ({ active, src, label, path, onClick }) => {
  const theme = useTheme()

  return (
    <BaseItem active={active} path={path} onClick={onClick}>
      <div
        css={`
          display: flex;
          align-items: center;
          gap: ${1 * GU}px;
        `}
      >
        <img src={src} alt="navigation icon" />
        <span
          css={`
            ${theme.content}
          `}
        >
          {label}
        </span>
      </div>
    </BaseItem>
  )
}

export default NavigationItem
