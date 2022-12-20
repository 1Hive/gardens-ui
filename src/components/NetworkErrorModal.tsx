import React, { useEffect, useState } from 'react'
import { GU, Modal, textStyle, useViewport } from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'
import flowerErrorLight from '@assets/flowerError.svg'
import flowerErrorDark from '@assets/dark-mode/flowerError.svg'

function NetworkErrorModal({ visible }: { visible: boolean }) {
  const { width } = useViewport()
  const { appearance } = useAppTheme()

  const [forceClose, setForceClose] = useState(false)

  useEffect(() => {
    if (visible) {
      setForceClose(false)
    }
  }, [visible])

  return (
    <Modal
      padding={7 * GU}
      visible={visible && !forceClose}
      width={Math.min(55 * GU, width - 40)}
      onClose={() => {
        setForceClose(true)
      }}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        `}
      >
        {appearance === 'light' ? (
          <img src={flowerErrorLight} alt="" height="88" width="71" />
        ) : (
          <img src={flowerErrorDark} alt="" height="140" width="120" />
        )}
        <h3
          css={`
            ${textStyle('title2')}
            margin-top: 24px;
            margin-bottom: 8px;
          `}
        >
          Something went wrong
        </h3>
        <h4
          css={`
            ${textStyle('body3')}
          `}
        >
          An error has occurred with the network connection.
        </h4>
      </div>
    </Modal>
  )
}

export default NetworkErrorModal
