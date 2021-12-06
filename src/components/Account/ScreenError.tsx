/** @jsx jsx */
import React, { useMemo, useRef } from 'react';
import { GU, Link, textStyle, useTheme } from '@1hive/1hive-ui';
import { ChainUnsupportedError } from 'use-wallet';
import { SUPPORTED_CHAINS } from '@/networks';
import { getNetworkName } from '@utils/web3-utils';
import connectionError from '@/assets/connection-error.svg';
import { css, jsx } from '@emotion/react';

function AccountModuleErrorScreen({ error, onBack }: { error: any; onBack: () => void }) {
  const theme = useTheme();
  const elementRef = useRef();

  let networkNames = '';
  SUPPORTED_CHAINS.forEach((chain, i, array) => {
    networkNames += getNetworkName(chain);
    if (i !== array.length - 1) {
      networkNames += ', ';
    }
  });

  const [title, secondary] = useMemo(() => {
    if (error instanceof ChainUnsupportedError) {
      return ['Wrong network', `Please select one of these networks in your wallet and try again: ${networkNames}`];
    }
    return ['Failed to enable your account', 'You can try another Ethereum wallet.'];
  }, [error, networkNames]);

  return (
    <section
      ref={elementRef}
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        css={css`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          css={css`
            position: relative;
            width: 281px;
            height: 188px;
            background: 50% 50% / 100% 100% no-repeat url(${connectionError});
          `}
        />
        <h1
          css={css`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          {title}
        </h1>
        <p
          css={css`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary.toString()};
          `}
        >
          {secondary}
        </p>
      </div>
      <div
        css={css`
          flex-grow: 0;
        `}
      >
        <Link onClick={onBack}>OK, try again</Link>
      </div>
    </section>
  );
}

export default AccountModuleErrorScreen;
