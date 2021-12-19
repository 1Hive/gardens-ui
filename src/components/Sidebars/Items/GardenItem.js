import React from 'react'

import { useTheme } from '@1hive/1hive-ui'

import BaseItem from './BaseItem'

const GardenItem = ({ active, label, path, src, onClick = () => {} }) => {
  const theme = useTheme()

  return (
    <BaseItem active={active} label={label} path={path} onClick={onClick}>
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
    </BaseItem>
  )
}

export default GardenItem
