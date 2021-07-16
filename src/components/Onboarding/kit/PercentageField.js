import React from 'react'
import PropTypes from 'prop-types'
import SliderField from './SliderField'

const PercentageField = React.forwardRef(
  ({ label = 'Percentage', value, onChange }, ref) => (
    <SliderField
      ref={ref}
      label={label}
      value={value}
      maxValue={100}
      valueSymbol="%"
      onChange={onChange}
    />
  )
)

PercentageField.propTypes = {
  label: PropTypes.node,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PercentageField
