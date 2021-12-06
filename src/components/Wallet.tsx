/** @jsx jsx */
import React from 'react';
import { Box, GU, LoadingRing, textStyle, useTheme } from '@1hive/1hive-ui';
import useAccountTokens from '../hooks/useAccountTokens';
import { useGardenState } from '../providers/GardenState';
import { formatTokenAmount } from '../utils/token-utils';
import { css, jsx } from '@emotion/react';
import styled from 'styled-components';

function Wallet({ account }) {
  const theme = useTheme();
  const { token } = useGardenState();
  const { decimals, logo, symbol } = token.data;
  const { inactiveTokens } = useAccountTokens(account, token.accountBalance);

  return (
    <Box padding={0}>
      <div
        css={css`
          padding: ${3 * GU}px;
        `}
      >
        <div>
          <Balance
            amount={token.accountBalance}
            decimals={decimals}
            icon={logo}
            label="Balance"
            loading={token.accountBalance.lt(0)}
            symbol={symbol}
          />
          <LineSeparator border={theme.border.toString()} />
          <Balance amount={inactiveTokens} decimals={decimals} icon={logo} inactive label="Idle" symbol={symbol} />
        </div>
      </div>
    </Box>
  );
}

const Balance = ({
  amount,
  decimals,
  icon,
  inactive = false,
  label,
  loading,
  symbol,
}: {
  amount;
  decimals;
  icon;
  label;
  symbol;
  loading?;
  inactive?;
}) => {
  const theme = useTheme();

  return (
    <div
      css={css`
        display: flex;
        align-items: flex-start;
      `}
    >
      <div
        css={css`
          margin-right: ${3 * GU}px;
        `}
      >
        <img
          src={icon}
          height="50"
          alt=""
          css={css`
            opacity: ${inactive ? 0.5 : 1};
          `}
        />
      </div>
      <div>
        <h5
          css={css`
            color: ${theme.contentSecondary.toString()};
          `}
        >
          {label}
        </h5>
        {loading ? (
          <LoadingRing />
        ) : (
          <span
            css={css`
              ${textStyle('title4')};
              color: ${theme[inactive ? 'negative' : 'content']};
            `}
          >
            {formatTokenAmount(amount, decimals)}
          </span>
        )}
      </div>
    </div>
  );
};

const LineSeparator = styled.div<{
  border: string;
}>`
  height: 1px;
  border-bottom: 0.5px solid ${({ border }) => border};
  margin: ${3 * GU}px 0;
`;

export default Wallet;
