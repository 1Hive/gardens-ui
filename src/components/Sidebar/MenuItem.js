import React, { useCallback } from 'react'
import { Link, GU } from '@1hive/1hive-ui'

function MenuItem({ active, path, name, src, onOpen }) {
  const handleClick = useCallback(
    event => {
      event.preventDefault()
      onOpen(path)
    },
    [onOpen, path]
  )

  return (
    <li
      css={`
        position: relative;
        background: ${active ? 'rgba(249, 249, 248, 1)' : null};
        border-left: ${active
          ? `4px solid rgba(141, 233, 149, 1)`
          : '4px solid transparent'};
        height: ${8.5 * GU}px;
      `}
    >
      <Link external={false} href={path} onClick={handleClick}>
        <div
          css={`
            padding: ${1.5 * GU}px;
            padding-left: ${1 * GU}px;
          `}
        >
          <img src={src} height={48} width={48} alt="" />
        </div>
      </Link>
    </li>
  )
}

export default MenuItem
