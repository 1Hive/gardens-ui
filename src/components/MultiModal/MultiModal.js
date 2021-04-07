import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { noop } from '@1hive/1hive-ui'
import { Inside } from 'use-inside'

function MultiModal({ visible, onClose, onClosed, children }) {
  const [render, setRender] = useState(visible)

  useEffect(() => {
    if (visible) {
      setRender(true)
    }
  }, [render, visible])

  const handleOnClosed = useCallback(() => {
    // Ensure react-spring has properly cleaned up state prior to unmount
    setTimeout(() => {
      onClosed()
      setRender(false)
    })
  }, [setRender, onClosed])

  return (
    <>
      {render && (
        <Inside name="MultiModal" data={{ onClose, handleOnClosed, visible }}>
          {children}
        </Inside>
      )}
    </>
  )
}

MultiModal.propTypes = {
  onClose: PropTypes.func,
  onClosed: PropTypes.func,
  visible: PropTypes.bool,
  children: PropTypes.node,
}

MultiModal.defaultProps = {
  onClose: noop,
  onClosed: noop,
}

export default MultiModal
