import React from 'react'
import { GU, Modal, textStyle, useViewport } from '@1hive/1hive-ui'
import flowerError from '../assets/flowerError.svg'

function NetworkErrorModal({ visible }) {
    const { below } = useViewport()
    const compactMode = below('medium')

    return (
        <Modal padding={7 * GU} visible={visible} width={compactMode ? '200px' : '400px'}>
        <div
            css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            `}
        >
            <img src={flowerError} alt="" height="88" width="71"/>
            <h3
            css={`
                ${textStyle('title3')}
                line-height: 40px;
                margin-top: 24px;
                margin-bottom: 8px;
                text-align:center;
            `}>
            Something went wrong
            </h3>
            <h4
                css={`
                    ${textStyle("body4")}
                    text-align:center;
                `}>
                    An error has occurred with the network connection.
                </h4>
        </div>
        </Modal>
    )
}

export default NetworkErrorModal