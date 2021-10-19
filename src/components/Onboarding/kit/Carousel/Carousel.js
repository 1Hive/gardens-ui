import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, useViewport, unselectable, springs } from '@1hive/1hive-ui'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import PrevNext from './PrevNext'

// TODO:
//  - Center the items when the total is smaller than the viewport.

const AnimatedDiv = animated.div

function Carousel({
  items,
  itemWidth,
  itemHeight,
  itemSpacing,
  onItemSelected = () => {},
}) {
  const [selected, setSelected] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [visibleItems, setVisibleItems] = useState(0)
  const container = useRef(null)
  const { width: vw } = useViewport()

  useEffect(() => {
    onItemSelected(selected)
  }, [onItemSelected, selected])

  // Set the number of visible items,
  // and adjust the selected item if needed.
  useEffect(() => {
    const visibleItems = Math.max(
      1,
      Math.floor((containerWidth - itemSpacing * 2) / (itemWidth + itemSpacing))
    )
    const lastSelectionableItem = items.length - visibleItems

    setVisibleItems(visibleItems)
    setSelected(selected =>
      selected > lastSelectionableItem ? lastSelectionableItem : selected
    )
  }, [containerWidth, itemSpacing, itemWidth, items])

  const updateContainerWidth = useCallback(element => {
    setContainerWidth(element ? element.clientWidth : 0)
  }, [])

  useEffect(() => {
    if (container.current) {
      updateContainerWidth(container.current)
    }
  }, [vw, updateContainerWidth])

  const handleContainerRef = useCallback(
    element => {
      container.current = element
      updateContainerWidth(element)
    },
    [updateContainerWidth]
  )

  const prev = useCallback(() => {
    setSelected(selected => Math.max(0, selected - visibleItems))
  }, [visibleItems])

  const next = useCallback(() => {
    setSelected(selected =>
      Math.min(items.length - visibleItems, selected + visibleItems)
    )
  }, [items.length, visibleItems])

  // The total width of the visible items
  const visibleItemsWidth =
    visibleItems * itemWidth + (visibleItems - 1) * itemSpacing

  // The space on one side of the visible items
  const sideSpace = (containerWidth - visibleItemsWidth) / 2

  // Get the container x position from an item index
  const xFromItem = useCallback(
    index => sideSpace - (itemWidth + itemSpacing) * index,
    [sideSpace, itemWidth, itemSpacing]
  )

  // The current x position, before the drag
  const selectedX = xFromItem(selected)

  // The x position of the last item, before the drag
  const lastX = xFromItem(items.length - visibleItems)

  // Handles the actual x position, with the drag
  const [{ x, drag }, setX] = useSpring(() => ({
    x: selectedX,
    config: springs.lazy,
    drag: Number(false),
    immediate: true,
  }))

  // Update the transition during drag
  const bindDrag = useDrag(({ down, delta }) => {
    const updatedX = Math.max(lastX, Math.min(sideSpace, selectedX + delta[0]))

    if (down) {
      setX({
        x: updatedX,
        immediate: true,
      })
    } else {
      let target = selected
      if (Math.abs(delta[0]) > itemWidth / 2) {
        if (delta[0] > 0) {
          target = Math.max(0, selected - 1)
        } else {
          target = Math.min(selected + 1, items.length - 1)
        }
      }

      setX({
        x: xFromItem(target),
        immediate: false,
      })
      setSelected(target)
    }
  })

  // Update the transition when the base x position updates
  useEffect(() => {
    setX({
      x: selectedX,
      immediate: false,
    })
  }, [selectedX, setX])

  return (
    <div
      ref={handleContainerRef}
      css={`
        ${unselectable};
        position: relative;
        overflow: hidden;
        width: 100%;
        height: ${itemHeight}px;
        touch-action: none;
      `}
    >
      {selected > 0 && <PrevNext type="previous" onClick={prev} />}
      {selected < items.length - visibleItems && (
        <PrevNext type="next" onClick={next} />
      )}
      <AnimatedDiv
        {...bindDrag()}
        style={{
          transform: x.interpolate(x => `translate3d(${(0, x)}px, 0, 0)`),
        }}
        css={`
          display: flex;
          height: 100%;
          position: absolute;
          touch-action: none;
        `}
      >
        {items.map((item, i) => (
          <AnimatedDiv
            key={i}
            style={{
              opacity: drag.interpolate(drag => {
                return drag || (i >= selected && i < selected + visibleItems)
                  ? 1
                  : 0.25
              }),
            }}
            css={`
              flex-grow: 0;
              flex-shrink: 0;
              width: ${itemWidth}px;
              height: ${itemHeight}px;
              transition: opacity 150ms ease-in-out;
              & + & {
                margin-left: ${3 * GU}px;
              }
            `}
          >
            {item}
          </AnimatedDiv>
        ))}
      </AnimatedDiv>
    </div>
  )
}

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemSpacing: PropTypes.number.isRequired,
  onItemSelected: PropTypes.func,
}

export default Carousel
