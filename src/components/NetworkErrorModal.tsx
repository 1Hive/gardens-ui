import React from 'react'
import { GU, Modal, textStyle, useViewport } from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'
import flowerErrorLight from '@assets/flowerError.svg'
import flowerErrorDark from '@assets/dark-mode/flowerError.svg'

function NetworkErrorModal({ visible }: { visible: boolean }) {
  const { width } = useViewport()
  const { appearance } = useAppTheme()

  return (
    <Modal
      padding={7 * GU}
      visible={visible}
      width={Math.min(55 * GU, width - 40)}
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
