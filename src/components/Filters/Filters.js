import React from 'react'
import PropTypes from 'prop-types'
import {
  BIG_RADIUS,
  Button,
  DropDown,
  GU,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import ListFilter from './ListFilter'
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
    proposalStatusFilter,
    proposalSupportFilter,
    proposalTypeFilter,
    onClearFilters,
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
        <div>
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
    </div>
  )
})

function CompactFilter({ ...props }) {
  const { below } = useViewport()

  const Filter = below('medium') ? CompactFilterSlider : CompactFilterBar
  return <Filter {...props} />
}

function CompactFilterBar({
  itemsStatus,
  itemsSupport,
  itemsType,
  proposalStatusFilter,
  proposalSupportFilter,
  proposalTypeFilter,
  onStatusFilterChange,
  onSupportFilterChange,
  onTypeFilterChange,
  supportFilterDisabled,
}) {
  const theme = useTheme()

  return (
    <div
      css={`
        width: 100%;
        padding: ${1.5 * GU}px;
        border-radius: ${BIG_RADIUS}px;
        border: 1px solid ${theme.border};
        background-color: ${theme.surface};
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          column-gap: ${1 * GU}px;
        `}
      >
        <DropDown
          header="Type"
          items={itemsType}
          onChange={onTypeFilterChange}
          placeholder="Type"
          selected={proposalTypeFilter}
        />
        <DropDown
          header="Status"
          items={itemsStatus}
          onChange={onStatusFilterChange}
          placeholder="Status"
          selected={proposalStatusFilter}
        />
        {!supportFilterDisabled && (
          <DropDown
            header="Support"
            items={itemsSupport}
            onChange={onSupportFilterChange}
            placeholder="Support"
            selected={proposalSupportFilter}
          />
        )}
      </div>
    </div>
  )
}

function CompactFilterSlider({ ...props }) {
  return <div>Slider</div>
}

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
