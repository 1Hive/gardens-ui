import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, Modal, Viewport } from '@1hive/1hive-ui'

const EMBED_ID = '1ZvXNsLEPAg'

const WelcomeModal = React.memo(function WelcomeModal({ onClose, visible }) {
  return (
    <Viewport>
      {({ width }) => {
        return (
          <Modal
            closeButton={false}
            padding={0}
            width={Math.min(860, width - 40)}
            visible={visible}
            css="z-index: 4"
          >
            <div
              css={`
                overflow: hidden;
                padding-bottom: 56.25%;
                position: relative;
                height: 0;
              `}
            >
              <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${EMBED_ID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                css={`
                  left: 0;
                  top: 0;
                  height: 100%;
                  width: 100%;
                  position: absolute;
                `}
              />
            </div>
            <div
              css={`
                padding: ${3 * GU}px;
              `}
            >
              <Button label="Close" wide mode="strong" onClick={onClose} />
            </div>
          </Modal>
        )
      }}
    </Viewport>
  )
})

WelcomeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default WelcomeModal
