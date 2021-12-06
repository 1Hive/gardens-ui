/** @jsx jsx */
import React from 'react';
import { GU } from '@1hive/1hive-ui';
import { css, jsx } from '@emotion/react';
import { formatTokenAmount } from '@utils/token-utils';

const splitAmount = (amount, decimals) => {
  const [integer, fractional] = formatTokenAmount(amount, decimals).split('.');
  return (
    <span
      css={css`
        margin-right: ${0.5 * GU}px;
      `}
    >
      <span>{integer}</span>
      {fractional && <span className="fractional">.{fractional}</span>}
    </span>
  );
};

const BalanceToken = ({ amount, color, decimals, icon, size, symbol }) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        color: ${color};
        ${size}
      `}
    >
      <img
        src={icon}
        alt=""
        width="24"
        height="24"
        style={{
          marginRight: `${1 * GU}px`,
        }}
      />
      {amount !== undefined && amount !== null ? splitAmount(amount, decimals) : ' - '}
      {symbol || ''}
    </div>
  );
};

export default BalanceToken;
