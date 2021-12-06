import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as OneHiveModal, GU, textStyle } from '@1hive/1hive-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const Modal = ({ children, title, buttonLabel, visible, onClick, onClose, width }) => (
  <OneHiveModal
    css={css`
      // Modal needs to pop up over onboarding surface
      z-index: 4;
    `}
    width={width}
    visible={visible}
    onClose={onClose}
  >
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 0 ${4 * GU}px;
        padding-top: ${2 * GU}px;
      `}
    >
      {title && (
        <div
          css={css`
            ${textStyle('title3')};
            margin-bottom: ${4 * GU}px;
          `}
        >
          {title}
        </div>
      )}
      {children}
      <Button
        css={css`
          align-self: flex-end;
          margin-top: ${3 * GU}px;
        `}
        label={buttonLabel ?? 'Done'}
        mode="strong"
        onClick={onClick}
      />
    </div>
  </OneHiveModal>
);

Modal.propTypes = {
  buttonLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  width: PropTypes.oneOfType([PropTypes.func, PropTypes.number, PropTypes.string]),
};

export default Modal;
