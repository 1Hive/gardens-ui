import React, { useState, useRef, useCallback } from 'react'
import { DropDown } from '@1hive/1hive-ui'
import PropTypes from 'prop-types'

import TextFilter from './TextFilter'
import DropdownFilter from './DropdownFilter'

const FilterBar = React.memo(
  ({
    proposalsSize = 0,
    proposalExecutionStatusFilter,
    proposalStatusFilter,
    proposalTextFilter,
    handleExecutionStatusFilterChange,
    handleProposalStatusFilterChange,
    handleTextFilterChange,
  }) => {
    const [textFieldVisible, setTextFieldVisible] = useState(false)
    const textFilterOpener = useRef(null)

    const handlerTextFilterClick = useCallback(() => {
      setTextFieldVisible(true)
    }, [setTextFieldVisible])

    const statusFilterDisabled = proposalExecutionStatusFilter === 1

    return (
      <div
        css={`
          display: flex;
          align-itmes: center;
        `}
      >
        <DropDown
          header="Status"
          selected={proposalExecutionStatusFilter}
          onChange={handleExecutionStatusFilterChange}
          items={['Open', 'Closed']}
        />
        {!statusFilterDisabled && (
          <DropdownFilter
            proposalsSize={proposalsSize}
            proposalStatusFilter={proposalStatusFilter}
            handleProposalStatusFilterChange={handleProposalStatusFilterChange}
          />
        )}
        <TextFilter
          textFilter={proposalTextFilter}
          updateTextFilter={handleTextFilterChange}
          placeholder="Search by name"
          visible={textFieldVisible}
          setVisible={setTextFieldVisible}
          openerRef={textFilterOpener}
          onClick={handlerTextFilterClick}
        />
      </div>
    )
  }
)

FilterBar.propTypes = {
  proposalsSize: PropTypes.number,
  proposalExecutionStatusFilter: PropTypes.number.isRequired,
  proposalStatusFilter: PropTypes.number.isRequired,
  proposalTextFilter: PropTypes.string.isRequired,
  handleExecutionStatusFilterChange: PropTypes.func.isRequired,
  handleProposalStatusFilterChange: PropTypes.func.isRequired,
  handleTextFilterChange: PropTypes.func.isRequired,
}

export default FilterBar
