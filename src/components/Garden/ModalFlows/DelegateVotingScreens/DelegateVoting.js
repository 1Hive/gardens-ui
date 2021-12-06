import React, { useCallback, useState } from 'react';
import { Button, Field, GU, isAddress, LoadingRing, TextInput, textStyle } from '@1hive/1hive-ui';
import IdentityBadge from '@components/IdentityBadge';

import { useMultiModal } from '@components/MultiModal/MultiModalProvider';
import useProfile from '@hooks/useProfile';
import { useSupporterSubscription } from '@hooks/useSubscriptions';
import { useWallet } from '@providers/Wallet';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const DelegateVoting = React.memo(function DelegateVoting({ getTransactions }) {
  const { account } = useWallet();
  const { next } = useMultiModal();
  const [representative, setRepresentative] = useState('');
  const [supporter, loading] = useSupporterSubscription(account);

  const handleRepresentativeChange = useCallback(event => {
    setRepresentative(event.target.value);
  }, []);

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      getTransactions(() => {
        next();
      }, representative);
    },
    [getTransactions, next, representative],
  );

  const hasRepresentative = Boolean(supporter?.representative);

  // TODO: Add validation for setting own account as represnetative
  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <LoadingRing />
      ) : (
        <div>
          {hasRepresentative && <CurrentDelegateProfile address={supporter.representative.address} />}
          <div
            css={css`
              display: flex;
              align-items: center;
              column-gap: 8px;
            `}
          >
            <Field
              label={`Your ${hasRepresentative ? 'new' : ''} delegate's address`}
              css={css`
                width: 100%;
              `}
            >
              <TextInput value={representative} onChange={handleRepresentativeChange} placeholder="0x" wide />
            </Field>
            <NewDelegateProfile address={representative} />
          </div>

          <div
            css={css`
              display: flex;
              align-items: center;
              column-gap: ${2 * GU}px;
            `}
          >
            <Button
              label={hasRepresentative ? 'Update delegate' : 'Delegate'}
              wide
              type="submit"
              mode="strong"
              disabled={!isAddress(representative)}
            />
          </div>
        </div>
      )}
    </form>
  );
});

function CurrentDelegateProfile({ address }) {
  return (
    <div
      css={css`
        margin-bottom: ${3 * GU}px;
      `}
    >
      <span
        css={css`
          ${textStyle('label2')};
        `}
      >
        Your current delegate
      </span>
      <div>
        <IdentityBadge entity={address} />
      </div>
    </div>
  );
}

function NewDelegateProfile({ address }) {
  const profile = useProfile(address);

  if (!address || !profile) {
    return null;
  }

  return (
    <div
      css={css`
        flex-shrink: 0;
      `}
    >
      <IdentityBadge entity={address} />
    </div>
  );
}

export default DelegateVoting;
