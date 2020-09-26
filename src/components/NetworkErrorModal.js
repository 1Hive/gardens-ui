import React from 'react'
import { GU, Modal } from '@1hive/1hive-ui'
import flower_error from '../assets/flower_error.svg'

function NetworkErrorModal({visible}) {
    <Modal
        padding={8*GU}
    >
        <div css={`
            display: flex;
            flex-direction: column;
        `}>
            <img src={flower_error} alt=""/>
            <h3 css={`
                ${textStyle("title2")}
            `}>Something went wrong</h3>
        </div>
    </Modal>
}

export default NetworkErrorModal;
