import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  Slider,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

const SliderField = React.forwardRef(function SliderField(
  { label, value, minValue = 0, maxValue = 100, valueSymbol = ' ', onChange },
  ref
) {
  const theme = useTheme()
  const inputRef = useRef()
  const [textFieldValue, setTextFieldValue] = useState(value)
  const textInputWidth =
    (5 + valueSymbol.length + maxValue.toString().length) * GU

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (inputRef.curent) {
          inputRef.current.focus()
        }
      },
      element: inputRef.current,
    }),
    []
  )

  useEffect(() => {
    setTextFieldValue(value)
  }, [value])

  const handleSliderChange = useCallback(
    v => {
      const value = Math.round(v * maxValue)
      onChange(value < minValue ? minValue : value)
    },
    [minValue, maxValue, onChange]
  )

  const handleInputChange = useCallback(
    event => {
      const value = parseInt(event.target.value, 10)

      // Allow empty values so it can be easier to update input
      if (!event.target.value) {
        setTextFieldValue('')
      } else if (!isNaN(value) && value >= minValue && value <= maxValue) {
        setTextFieldValue(value)
      }
    },
    [minValue, maxValue]
  )

  const handleInputBlur = useCallback(() => {
    // It can be an empty value so we need to parse it again
    const value = parseInt(textFieldValue, 10)

    if (!isNaN(value)) {
      onChange(value)
    } else {
      onChange(minValue)
    }
  }, [minValue, onChange, textFieldValue])

  return (
    <Field label={label}>
      {({ id }) => (
        <div
          css={`
            display: flex;
            flex-direction: row;
          `}
        >
          <Slider
            value={value / maxValue}
            onUpdate={handleSliderChange}
            css={`
              flex-grow: 1;
              padding-left: 0;
              padding-right: 0;
              margin-right: ${3 * GU}px;
              min-width: ${20 * GU}px;
            `}
          />
          <div
            css={`
              position: relative;
              flex-grow: 0;
              flex-shrink: 0;
              width: ${textInputWidth}px;
            `}
          >
            <TextInput
              ref={inputRef}
              id={id}
              value={textFieldValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              wide
              css={`
                padding-right: ${3.5 * GU + valueSymbol.length * 0.5 * GU}px;
                text-align: right;
              `}
            />
            {valueSymbol && (
              <span
                css={`
                  position: absolute;
                  top: 0;
                  right: ${1.5 * GU}px;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  ${textStyle('body3')};
                  color: ${theme.surfaceContent};
                  pointer-events: none;
                `}
              >
                {valueSymbol}
              </span>
            )}
          </div>
        </div>
      )}
    </Field>
  )
})

SliderField.propTypes = {
  label: PropTypes.node,
  minValue: PropTypes.number,
  maxValue: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  valueSymbol: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default SliderField
