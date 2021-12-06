import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, GU, IconCross, IconCheck } from '@1hive/1hive-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function CheckDisc({ mode, size }) {
  const theme = useTheme();
  const Icon = mode === 'error' ? IconCross : IconCheck;
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${mode === 'error' ? theme.negative.toString() : theme.positive.toString()};
        color: ${mode === 'error' ? theme.negativeContent.toString() : theme.positiveContent.toString()};
      `}
    >
      <Icon width={size * 0.55} height={size * 0.55} />
    </div>
  );
}

CheckDisc.propTypes = {
  mode: PropTypes.oneOf(['success', 'error']),
  size: PropTypes.number,
};

CheckDisc.defaultProps = {
  mode: 'success',
  size: 3 * GU,
};

export default CheckDisc;
