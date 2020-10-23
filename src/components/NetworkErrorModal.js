import React from 'react'
import { GU, Modal, textStyle, useViewport } from '@1hive/1hive-ui'
import flowerError from '../assets/flowerError.svg'

function NetworkErrorModal({ visible }) {
  const { width } = useViewport()

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
        <img src={flowerError} alt="" height="88" width="71" />
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
