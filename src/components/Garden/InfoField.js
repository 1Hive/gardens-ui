import React from 'react'
import { Field, GU } from '@1hive/1hive-ui'

function InfoField({ label, children, ...props }) {
  return (
    <Field
      label={label}
      {...props}
      css={`
        margin-bottom: 0;
      `}
    >
      {/* Pass unused id to disable clickable label  */}
      {({ id }) => (
        <div
          css={`
            padding-top: ${0.5 * GU}px;
          `}
        >
          {children}
        </div>
      )}
    </Field>
  )
}

export default InfoField
