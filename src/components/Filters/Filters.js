import React from 'react'
import PropTypes from 'prop-types'
import { Button, DropDown, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import CompactFilter from './CompactFilter'
import ListFilter from './ListFilter'
import TextFilter from './TextFilter'
import { useWallet } from '../../providers/Wallet'
import { STATUS_FILTER_OPEN } from '../../utils/filter-utils'

const Filters = React.memo(({ compact, ...props }) => {
  const theme = useTheme()
  const { account } = useWallet()

  const supportFilterDisabled =
    props.proposalStatusFilter > STATUS_FILTER_OPEN || !account

  if (compact) {
    return (
      <CompactFilter {...props} supportFilterDisabled={supportFilterDisabled} />
    )
  }

  const {
    itemsStatus,
    itemsSupport,
    itemsType,
    proposalNameFilter,
    proposalStatusFilter,
    proposalSupportFilter,
    proposalTypeFilter,
    onClearFilters,
    onNameFilterChange,
    onStatusFilterChange,
    onSupportFilterChange,
    onTypeFilterChange,
  } = props

  return (
    <div
      css={`
        min-width: 270px;
        height: fit-content;
        margin-top: ${3 * GU}px;
        margin-right: ${8 * GU}px;
        top: ${3 * GU}px;
        position: sticky;
      `}
    >
      <div
        css={`
          margin-bottom: ${4 * GU}px;
          padding-bottom: ${3 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            column-gap: ${2 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        >
          <div
            css={`
              ${textStyle('label2')};
            `}
          >
            Filters
          </div>
          <Button onClick={onClearFilters} label="Clear" size="mini" />
        </div>
        <ListFilter
          items={itemsType}
          onChange={onTypeFilterChange}
          selected={proposalTypeFilter}
        />
      </div>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <label
          css={`
            display: block;
            ${textStyle('label2')};
            margin-bottom: ${1 * GU}px;
          `}
        >
          Status
        </label>
        <DropDown
          header="Status"
          items={itemsStatus}
          onChange={onStatusFilterChange}
          selected={proposalStatusFilter}
          wide
        />
      </div>
      {!supportFilterDisabled && (
        <div
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <label
            css={`
              display: block;
              ${textStyle('label2')};
              margin-bottom: ${1 * GU}px;
            `}
          >
            Support
          </label>
          <DropDown
            header="Support"
            items={itemsSupport}
            onChange={onSupportFilterChange}
            selected={proposalSupportFilter}
            wide
          />
        </div>
      )}
      <TextFilter
        text={proposalNameFilter}
        onChange={onNameFilterChange}
        placeholder="Search by name"
      />
    </div>
  )
})

Filters.propTypes = {
  itemsStatus: PropTypes.array.isRequired,
  itemsSupport: PropTypes.array.isRequired,
  itemsType: PropTypes.array.isRequired,
  proposalStatusFilter: PropTypes.number.isRequired,
  proposalSupportFilter: PropTypes.number.isRequired,
  proposalTypeFilter: PropTypes.number.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  onSupportFilterChange: PropTypes.func.isRequired,
  onTypeFilterChange: PropTypes.func.isRequired,
}

export default Filters
