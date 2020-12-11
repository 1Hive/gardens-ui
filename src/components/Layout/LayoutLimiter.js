import React from 'react'

function LayoutLimiter({ children, ...props }) {
  return (
    <div
      css={`
        margin-left: auto;
        margin-right: auto;
        max-width: 1280px;
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default LayoutLimiter
