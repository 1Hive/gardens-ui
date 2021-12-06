import React, { useCallback } from 'react';
import { GU, textStyle, Button } from '@1hive/1hive-ui';
import { useMultiModal } from '@components/MultiModal/MultiModalProvider';
import connectionError from '@/assets/connection-error.svg';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function ConectWallet({ onDismiss }) {
  const { next } = useMultiModal();
  const handleOnConnect = useCallback(() => {
    next();
  }, [next]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      `}
    >
      <h3
        css={css`
          ${textStyle('title2')}
          margin-bottom: 8px;
        `}
      >
        Connect your account
      </h3>
      <h4
        css={css`
          ${textStyle('body2')}
          margin-top: ${3 * GU}px;
        `}
      >
        You need to connect your account to create a garden
      </h4>
      <img
        css={css`
          margin-top: ${3 * GU}px;
        `}
        src={connectionError}
      />
      <div
        css={css`
          display: flex;
          margin-top: ${3 * GU}px;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Button
          onClick={() => onDismiss(false)}
          wide
          css={css`
            margin-top: ${3 * GU}px;
            margin-right: ${2 * GU}px;
            width: ${30 * GU}px;
          `}
        >
          Dismiss
        </Button>
        <Button
          mode="strong"
          onClick={handleOnConnect}
          wide
          css={css`
            margin-top: ${3 * GU}px;
            width: ${30 * GU}px;
          `}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}

export default ConectWallet;
