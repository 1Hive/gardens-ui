import React, { useCallback } from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'

function ListFilter({ items, selected, onChange }) {
  return (
    <div>
      {items.map((item, index) => (
        <ListItem
          key={index}
          index={index}
          item={item}
          onSelect={onChange}
          selected={selected}
        />
      ))}
    </div>
  )
}

function ListItem({ index, item, onSelect, selected }) {
  const theme = useTheme()

  const handleOnClick = useCallback(() => {
    onSelect(index)
  }, [index, onSelect])

  return (
    <div
      onClick={handleOnClick}
      css={`
        margin-bottom: ${1 * GU}px;
        color: ${theme.contentSecondary};

        ${selected === index
          ? `
          color:${theme.content}
        `
          : 'cursor:pointer'};
      `}
    >
      {item}
    </div>
  )
}

export default ListFilter
