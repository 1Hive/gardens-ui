import React, { useState, useRef, useCallback } from 'react'
import { DropDown, GU } from '@1hive/1hive-ui'
import PropTypes from 'prop-types'

import TextFilter from './TextFilter'
import DropdownFilter from './DropdownFilter'

const FilterBar = React.memo(
  ({
    proposalsSize = 0,
    proposalExecutionStatusFilter,
    proposalStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
    handleExecutionStatusFilterChange,
    handleProposalStatusFilterChange,
    handleTextFilterChange,
    handleProposalTypeFilterChange,
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
          header="Type"
          placeholder="All"
          selected={proposalTypeFilter}
          onChange={handleProposalTypeFilterChange}
          items={['All', 'Funding', 'Signaling']}
        />
        <DropDown
          header="Status"
          placeholder="All"
          selected={proposalExecutionStatusFilter}
          onChange={handleExecutionStatusFilterChange}
          items={['All', 'Open', 'Closed', 'Removed']}
          css={`
            margin-left: ${1.5 * GU}px;
          `}
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
