import React, { useCallback } from 'react'
import { Field, GU, TextInput, textStyle, useTheme } from '@1hive/1hive-ui'

// matches a number up to two decimals
const regex = /^\d*(\.\d{0,2})?$/

const AmountField = ({
  label,
  min = 0,
  max,
  onChange,
  required,
  unitSymbol,
  value,
  ...props
}) => {
  const theme = useTheme()

  const handleInputChange = useCallback(
    e => {
      const value = parseFloat(e.target.value)
      if (
        !isNaN(value) &&
        regex.test(value) &&
        value >= min &&
        (max ? value < max : true)
      ) {
        onChange(value)
      }
    },
    [min, max, onChange]
  )

  return (
    <Field label={label} required={required}>
      <div
        css={`
          position: relative;
        `}
      >
        <TextInput
          css={`
            ::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            ::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            -moz-appearance: textfield;
          `}
          type="number"
          value={value}
          onChange={handleInputChange}
          {...props}
        />
        {unitSymbol && (
          <span
            css={`
              position: absolute;
              top: 0;
              right: ${1.5 * GU}px;
              bottom: 0;
              display: flex;
              align-items: center;
              ${textStyle('body3')};
              color: ${theme.contentSecondary};
              pointer-events: none;
            `}
          >
            {unitSymbol}
          </span>
        )}
      </div>
    </Field>
  )
}

export default AmountField
