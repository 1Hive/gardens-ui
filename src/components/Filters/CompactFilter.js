import React, { useCallback, useState } from 'react'
import { animated, Transition } from 'react-spring/renderprops'
import {
  BIG_RADIUS,
  DropDown,
  GU,
  IconCross,
  RootPortal,
  SearchInput,
  springs,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import arrowDownSvg from '../../assets/arrowDown.svg'

function CompactFilter({ ...props }) {
  const { below } = useViewport()

  const Filter = below('medium') ? CompactFilterSlider : CompactFilterBar
  return <Filter {...props} />
}

function CompactFilterBar({
  itemsStatus,
  itemsSupport,
  itemsType,
  proposalNameFilter,
  proposalStatusFilter,
  proposalSupportFilter,
  proposalTypeFilter,
  onNameFilterChange,
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
        <SearchInput
          value={proposalNameFilter}
          onChange={onNameFilterChange}
          placeholder="Search by name"
          css={`
            width: ${30 * GU}px;
          `}
        />
      </div>
    </div>
  )
}

function CompactFilterSlider({
  itemsStatus,
  itemsSupport,
  itemsType,
  proposalNameFilter,
  proposalStatusFilter,
  proposalSupportFilter,
  proposalTypeFilter,
  onNameFilterChange,
  onStatusFilterChange,
  onSupportFilterChange,
  onTypeFilterChange,
  onToggleFilterSlider,
  sliderVisible,
  supportFilterDisabled,
}) {
  const theme = useTheme()

  return (
    <AnimatedSlider visible={sliderVisible}>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        `}
      >
        <div>
          <div
            css={`
              padding: ${3 * GU}px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <div
              css={`
                ${textStyle('body1')};
              `}
            >
              Filters
            </div>
            <div
              css={`
                cursor: pointer;
              `}
              onClick={onToggleFilterSlider}
            >
              <IconCross color={theme.surfaceIcon} />
            </div>
          </div>
          <AnimatedFilter
            header="Type"
            items={itemsType}
            onSelect={onTypeFilterChange}
            selected={proposalTypeFilter}
          />
          <AnimatedFilter
            header="Status"
            items={itemsStatus}
            onSelect={onStatusFilterChange}
            selected={proposalStatusFilter}
          />
          {!supportFilterDisabled && (
            <AnimatedFilter
              header="Support"
              items={itemsSupport}
              onSelect={onSupportFilterChange}
              selected={proposalSupportFilter}
            />
          )}
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <SearchInput
              value={proposalNameFilter}
              onChange={onNameFilterChange}
              placeholder="Search by name"
              wide
              css="border-radius: 0;"
            />
          </div>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          {/* TODO: select filters locally */}
          {/* <Button label="Clear" />
          <Button label="Apply" mode="strong" /> */}
        </div>
      </div>
    </AnimatedSlider>
  )
}

function AnimatedSlider({ children, visible }) {
  const theme = useTheme()
  return (
    <RootPortal>
      <Transition
        native
        items={visible}
        from={{ opacity: 0, transform: 'translateY(100%)' }}
        enter={{ opacity: 1, transform: 'translateY(0%)' }}
        leave={{ opacity: 0, transform: 'translateY(100%)' }}
        config={{ ...springs.smooth, precision: 0.001 }}
      >
        {show =>
          show &&
          (({ opacity, transform }) => (
            <div>
              <animated.div
                style={{
                  position: 'fixed',
                  opacity,
                  top: '0',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  zIndex: '4',
                  background: theme.overlay.alpha(0.9),
                }}
              >
                <animated.div
                  style={{
                    transform,
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.15))',
                  }}
                >
                  <div
                    css={`
                      height: calc(100vh - ${3 * GU}px);
                      background-color: ${theme.surface};
                      border-top-left-radius: 16px;
                      border-top-right-radius: 16px;
                    `}
                  >
                    {children}
                  </div>
                </animated.div>
              </animated.div>
            </div>
          ))
        }
      </Transition>
    </RootPortal>
  )
}

function AnimatedFilter({ header, items, selected, onSelect }) {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)

  const handleFilterToggle = useCallback(() => {
    setOpened(opened => !opened)
  }, [])

  return (
    <div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid ${theme.border};
          cursor: pointer;
          padding: ${2 * GU}px;

          &:hover {
            background: ${theme.surfaceHighlight};
          }

          &:active {
            background: ${theme.surfacePressed};
          }
        `}
        onClick={handleFilterToggle}
      >
        <div>{header}</div>
        <div
          css={`
            transform: rotate(${opened ? '180deg' : '0deg'});
            transition: transform 0.3s ease;
          `}
        >
          <img src={arrowDownSvg} alt="" />
        </div>
      </div>
      <Transition
        native
        items={opened}
        from={{ height: 0 }}
        enter={{ height: 'auto' }}
        leave={{ height: 0 }}
        config={{ ...springs.smooth, precision: 0.1 }}
      >
        {show =>
          show &&
          (({ height }) => (
            <animated.div
              style={{
                height: height.interpolate(v => `${v}px`),
                overflow: 'hidden',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <ul
                css={`
                  list-style: none;
                `}
              >
                {items.map((item, index) => (
                  <ListItem
                    key={index}
                    index={index}
                    item={item}
                    selected={selected}
                    onSelect={onSelect}
                  />
                ))}
              </ul>
            </animated.div>
          ))
        }
      </Transition>
    </div>
  )
}

function ListItem({ index, item, onSelect, selected }) {
  const theme = useTheme()
  const isSelected = selected === index

  const handleOnClick = useCallback(() => {
    onSelect(index)
  }, [index, onSelect])

  return (
    <li
      onClick={handleOnClick}
      css={`
        cursor: pointer;
        padding: ${1 * GU}px ${2 * GU}px;
        color: ${isSelected ? theme.content : theme.contentSecondary};
        background: ${isSelected ? '#EAFAF9' : theme.surface};
        ${!isSelected &&
          `
          &:hover {
            background: #EAFAF9;
          }
        `}
      `}
    >
      {item}
    </li>
  )
}

export default CompactFilter
