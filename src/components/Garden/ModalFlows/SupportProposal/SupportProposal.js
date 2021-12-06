import React, { useCallback, useMemo, useState } from 'react';
import { Button, ButtonBase, Field, GU, Info, TextInput, useTheme } from '@1hive/1hive-ui';
import useAccountTotalStaked from '@hooks/useAccountTotalStaked';
import { useGardenState } from '@providers/GardenState';
import { useWallet } from '@providers/Wallet';
import { useMultiModal } from '@components/MultiModal/MultiModalProvider';

import { toDecimals, round, pct } from '@utils/math-utils';
import { formatTokenAmount } from '@utils/token-utils';
import BigNumber from '@lib/bigNumber';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const SupportProposal = React.memo(function SupportProposal({ getTransactions }) {
  const theme = useTheme();
  const [amount, setAmount] = useState({
    value: '0',
    valueBN: new BigNumber('0'),
  });

  const { account } = useWallet();
  const { config, token } = useGardenState();
  const { stakeToken } = config.conviction;
  const { next } = useMultiModal();

  const totalStaked = useAccountTotalStaked(account);
  const nonStakedTokens = token.accountBalance.minus(totalStaked);

  const handleEditMode = useCallback(
    editMode => {
      setAmount(amount => {
        const newValue = amount.valueBN.gte(0)
          ? formatTokenAmount(amount.valueBN, stakeToken.decimals, false, false, {
              commas: !editMode,
              replaceZeroBy: editMode ? '' : '0',
              rounding: stakeToken.decimals,
            })
          : '';

        return {
          ...amount,
          value: newValue,
        };
      });
    },
    [stakeToken],
  );

  // Amount change handler
  const handleAmountChange = useCallback(
    event => {
      const newAmount = event.target.value.replace(/,/g, '.').replace(/-/g, '');

      const newAmountBN = new BigNumber(isNaN(event.target.value) ? -1 : toDecimals(newAmount, stakeToken.decimals));

      setAmount({
        value: newAmount,
        valueBN: newAmountBN,
      });
    },
    [stakeToken],
  );

  const handleMaxSelected = useCallback(() => {
    setAmount({
      valueBN: nonStakedTokens,
      value: formatTokenAmount(nonStakedTokens, stakeToken.decimals, false, false, {
        commas: false,
        rounding: stakeToken.decimals,
      }),
    });
  }, [nonStakedTokens, stakeToken]);

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      getTransactions(() => {
        next();
      }, amount.valueBN.toString(10));
    },
    [amount, getTransactions, next],
  );

  const errorMessage = useMemo(() => {
    if (amount.valueBN.eq(new BigNumber(-1))) {
      return 'Invalid amount';
    }

    if (amount.valueBN.gt(nonStakedTokens)) {
      return 'Insufficient balance';
    }

    return null;
  }, [amount, nonStakedTokens]);

  // Calculate percentages
  const nonStakedPct = round(pct(nonStakedTokens, token.accountBalance));
  const stakedPct = round(100 - nonStakedPct);

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="amount"
        css={css`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          value={amount.value}
          onChange={handleAmountChange}
          onFocus={() => handleEditMode(true)}
          onBlur={() => handleEditMode(false)}
          wide
          adornment={
            <ButtonBase
              css={css`
                margin-right: ${1 * GU}px;
                color: ${theme.accent.toString()};
              `}
              onClick={handleMaxSelected}
            >
              MAX
            </ButtonBase>
          }
          adornmentPosition="end"
        />
      </Field>
      <Button
        label="Support this proposal"
        wide
        type="submit"
        mode="strong"
        disabled={amount.valueBN.eq(new BigNumber(0)) || Boolean(errorMessage)}
      />
      {errorMessage && (
        <Info
          mode="warning"
          css={css`
            margin-top: ${2 * GU}px;
          `}
        >
          {errorMessage}
        </Info>
      )}
      <Info
        css={css`
          margin-top: ${2 * GU}px;
        `}
      >
        You have{' '}
        <strong>
          {formatTokenAmount(nonStakedTokens, stakeToken.decimals)} {stakeToken.symbol}
        </strong>{' '}
        ({nonStakedPct}% of your balance) available to support this proposal.{' '}
        {totalStaked.gt(0) && (
          <span>
            You are supporting other proposals with{' '}
            <strong>
              {formatTokenAmount(totalStaked, stakeToken.decimals)} {stakeToken.symbol}
            </strong>{' '}
            ({stakedPct}% of your balance).
          </span>
        )}
      </Info>
    </form>
  );
});

export default SupportProposal;
