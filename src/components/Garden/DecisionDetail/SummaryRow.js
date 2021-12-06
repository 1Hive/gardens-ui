/** @jsx jsx */
import React from 'react';
import { GU, textStyle, useTheme } from '@1hive/1hive-ui';
import { formatTokenAmount } from '@utils/token-utils';
import { css, jsx } from '@emotion/react';
import styled from 'styled-components';

/* eslint-disable react/prop-types */
function SummaryRow({ color, label, pct, token, ...props }) {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        margin-bottom: ${1 * GU}px;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        ${textStyle('body2')};
      `}
      {...props}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Bullet color={color} />
        <div
          css={css`
            width: ${4 * GU}px;
            color: ${theme.surfaceContentSecondary.toString()};
          `}
        >
          {label}
        </div>
        <div>{pct}%</div>
      </div>
      {token && (
        <div
          css={css`
            color: ${theme.surfaceContentSecondary.toString()};
            margin-left: ${2 * GU}px;
          `}
        >
          {formatTokenAmount(token.amount, token.decimals)} {token.symbol}
        </div>
      )}
    </div>
  );
}

const Bullet = styled.div`
  flex-shrink: 0;
  display: block;
  width: ${1 * GU}px;
  height: ${1 * GU}px;
  margin-right: ${1 * GU}px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

export default React.memo(SummaryRow);
