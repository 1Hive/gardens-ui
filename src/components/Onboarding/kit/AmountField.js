import React, { useCallback, useEffect, useState } from 'react'
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
  const [amountFieldValue, setAmountFieldValue] = useState(value)

  useEffect(() => {
    setAmountFieldValue(value)
  }, [value])

  const handleInputChange = useCallback(
    e => {
      const value = parseFloat(e.target.value)

      // Allow empty values so it can be easier to update input
      if (!e.target.value) {
        setAmountFieldValue('')
      } else if (
        !isNaN(value) &&
        regex.test(value) &&
        value >= min &&
        (max ? value < max : true)
      ) {
        setAmountFieldValue(value)
      }
    },
    [min, max]
  )

  const handleInputBlur = useCallback(() => {
    // It can be an empty value so we need to parse it again
    const value = parseFloat(amountFieldValue)

    if (!isNaN(value)) {
      onChange(value)
    } else {
      onChange(min)
    }
  }, [min, onChange, amountFieldValue])

  return (
    <Field label={label} required={required}>
      <div
        css={`
          position: relative;
        `}
      >
        <TextInput
          type="number"
          value={amountFieldValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          {...props}
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
