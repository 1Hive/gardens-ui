import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@1hive/1hive-ui'
import Tab from './Tab'

function Tabs({ items, selected, onChange }) {
  return (
    <nav
      css={`
        padding-left: ${6 * GU}px;
        text-align: left;
      `}
    >
      <ul>
        {items.map((item, i) => (
          <Tab
            key={i}
            index={i}
            item={item}
            onChange={onChange}
            selected={i === selected}
          />
        ))}
      </ul>
    </nav>
  )
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  selected: PropTypes.number,
  onChange: PropTypes.func,
}

Tabs.defaultProps = {
  selected: 0,
  onChange: () => {},
}

export default Tabs
