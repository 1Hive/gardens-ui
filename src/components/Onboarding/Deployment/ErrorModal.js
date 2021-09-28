import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  GU,
  Modal,
  Root,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import CheckDisc from './CheckDisc'

function ErrorModal({ action, content, header, onClose, visible }) {
  const theme = useTheme()
  const { below } = useViewport()
  const smallMode = below('medium')

  const modalWidth = useCallback(
    ({ width }) => Math.min(55 * GU, width - 4 * GU),
    []
  )

  return (
    <Root.Provider>
      <Modal
        visible={visible}
        width={modalWidth}
        onClose={onClose}
        closeButton={Boolean(onClose)}
      >
        <section
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: ${smallMode ? 0 : 3 * GU}px;
            padding-top: ${smallMode ? 5 * GU : 8 * GU}px;
            padding-bottom: ${smallMode ? 0 : 2 * GU}px;
            text-align: center;
          `}
        >
          <CheckDisc mode="error" size={9 * GU} />
          <h1
            css={`
              margin: ${4 * GU}px auto ${1 * GU}px;
              ${textStyle('title2')};
            `}
          >
            {header}
          </h1>
          <p
            css={`
              margin-bottom: ${7 * GU}px;
              ${textStyle('body1')};
              color: ${theme.contentSecondary};
            `}
          >
            {content}
          </p>
          {action}
        </section>
      </Modal>
    </Root.Provider>
  )
}

ErrorModal.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  visible: PropTypes.bool.isRequired,
}

export default ErrorModal
