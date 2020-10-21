import React from 'react'
import PropTypes from 'prop-types'

import { GU, Popover, SearchInput, useLayout } from '@1hive/1hive-ui'

const TextFilter = React.memo(
  ({ textFilter, updateTextFilter, placeholder = '' }) => {
    const { layoutName } = useLayout()
    const compactMode = layoutName === 'small'

    return (
      <div
        css={`
          margin-left: ${1.5 * GU}px;
          ${compactMode && `margin-bottom: ${1.5 * GU}px;`}
        `}
      >
        <SearchInput
          value={textFilter}
          onChange={updateTextFilter}
          placeholder={placeholder}
          css={`
            width: ${32 * GU}px;
          `}
        />
      </div>
    )
  }
)

const TextFilterPopover = ({
  textFilter,
  updateTextFilter,
  visible,
  setVisible,
  opener,
}) => (
  <Popover
    visible={visible}
    opener={opener}
    onClose={() => setVisible(false)}
    css={`
      padding: ${1.5 * GU}px;
    `}
    placement="bottom-end"
  >
    <SearchInput value={textFilter} onChange={updateTextFilter} />
  </Popover>
)

TextFilterPopover.propTypes = {
  textFilter: PropTypes.string.isRequired,
  updateTextFilter: PropTypes.func.isRequired,
  opener: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

TextFilter.propTypes = {
  textFilter: PropTypes.string.isRequired,
  updateTextFilter: PropTypes.func.isRequired,
}

export default TextFilter
