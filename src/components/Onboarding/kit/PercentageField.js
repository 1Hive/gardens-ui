import React from 'react'
import PropTypes from 'prop-types'
import SliderField from './SliderField'

const PercentageField = React.forwardRef(
  ({ label = 'Percentage', value, minValue, onChange }, ref) => (
    <SliderField
      ref={ref}
      label={label}
      value={value}
      minValue={minValue}
      maxValue={100}
      valueSymbol="%"
      onChange={onChange}
    />
  )
)

PercentageField.propTypes = {
  label: PropTypes.node,
  minValue: PropTypes.number,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PercentageField
