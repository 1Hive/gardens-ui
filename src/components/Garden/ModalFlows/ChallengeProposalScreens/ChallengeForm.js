/** @jsx jsx */
import React, { useState, useCallback, useMemo } from 'react';
import { TextInput, formatTokenAmount, Field, textStyle, GU, useTheme } from '@1hive/1hive-ui';
import InfoField from '../../InfoField';
import ModalButton from '../ModalButton';
import { useMultiModal } from '@components/MultiModal/MultiModalProvider';
import HelpTip from '@components/HelpTip';
import { durationToHours, toMs } from '@utils/date-utils';
import BigNumber from '@lib/bigNumber';
import { toDecimals } from '@utils/math-utils';
import { toHex } from 'web3-utils';
import { css, jsx } from '@emotion/react';

function ChallengeRequirements({ getTransactions, proposal }) {
  const theme = useTheme();

  const { collateralRequirement, actionId } = proposal;
  const { challengeDuration, tokenDecimals, tokenSymbol, challengeAmount } = collateralRequirement;

  const settlementPeriodHours = durationToHours(toMs(challengeDuration));

  const [error, setError] = useState(null);
  const [argument, setArgument] = useState('');
  const [loading, setLoading] = useState(false);
  const { next } = useMultiModal();

  const maxChallengeAmount = useMemo(() => formatTokenAmount(challengeAmount, tokenDecimals), [
    challengeAmount,
    tokenDecimals,
  ]);

  const [settlementAmount, setSettlementAmount] = useState(maxChallengeAmount.toString());

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      const amountBN = new BigNumber(toDecimals(settlementAmount, tokenDecimals));
      setLoading(true);

      // Proceed to the next screen after transactions have been received
      // handleChallengeAction(next)

      getTransactions(
        () => {
          next();
        },
        actionId,
        amountBN.toString(10),
        true,
        toHex(argument),
      );
    },
    [argument, next, actionId, getTransactions, settlementAmount, tokenDecimals],
  );

  const handleArgumentChange = useCallback(({ target }) => {
    setArgument(target.value);
  }, []);

  const handleSettlementChange = useCallback(
    ({ target }) => {
      if (Number(target.value) < 0 || Number(target.value) > Number(maxChallengeAmount)) {
        setError(true);
      } else {
        setError(null);
      }
      setSettlementAmount(target.value);
    },
    [maxChallengeAmount],
  );

  return (
    <form onSubmit={handleSubmit}>
      <InfoField
        label={
          <>
            Settlement Period
            <HelpTip type="settlement-period" />
          </>
        }
        css={css`
          margin-top: ${1 * GU}px;
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <p>
          {settlementPeriodHours}{' '}
          <span
            css={css`
              color: ${theme.surfaceContentSecondary.toString()};
            `}
          >
            Hours
          </span>
        </p>
      </InfoField>

      <Field
        label={
          <>
            Settlement Offer
            <HelpTip type="settlement-offer" />
          </>
        }
        css={css`
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <TextInput
          value={settlementAmount}
          type="number"
          max={maxChallengeAmount}
          wide
          onChange={handleSettlementChange}
          adornment={<> </>}
          adornmentPosition="end"
          adornmentSettings={{ padding: 0.5 * GU }}
          required
        />
        <p
          css={css`
            margin-top: ${1 * GU}px;
            color: ${theme.surfaceContentSecondary.toString()};
            ${textStyle('body3')};
          `}
        >
          This amount cannot be greater than the proposal creation deposit amount : {maxChallengeAmount} {tokenSymbol}.
        </p>
      </Field>

      <Field
        label="Argument in favour of your challenge"
        css={css`
          margin-bottom: 0px;
        `}
      >
        <TextInput
          multiline
          value={argument}
          wide
          onChange={handleArgumentChange}
          required
          css={css`
            min-height: ${15 * GU}px;
          `}
        />
      </Field>
      <ModalButton mode="strong" type="submit" loading={loading} disabled={error}>
        Create transaction
      </ModalButton>
    </form>
  );
}

export default ChallengeRequirements;
