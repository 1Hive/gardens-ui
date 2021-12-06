/** @jsx jsx */
import React from 'react';
import { GU } from '@1hive/1hive-ui';
import honeySvg from '@assets/IconHNYLoader.svg';
import { css, jsx, keyframes } from '@emotion/react';

const spinAnimation = css`
  mask-image: linear-gradient(35deg, transparent 15%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `} 1.25s linear infinite;
`;

function TokenLoader() {
  console.log(spinAnimation);
  return (
    <div
      css={css`
        width: 150px;
        margin-bottom: ${3 * GU}px 0;
      `}
    >
      <div
        css={css`
          position: relative;
          width: 100%;
          padding-top: 100%;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <img
            src={honeySvg}
            alt="HNY"
            css={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              line-height: 1;
              color: #ffffff;
              font-size: 24px;
              font-weight: 600;
              z-index: 1;
            `}
          />

          <div
            css={css`
              border-radius: 100%;
              border: 2px solid #ffe862;
              width: 70px;
              height: 70px;
              position: absolute;
              top: 0;
              ${spinAnimation};
            `}
          />
        </div>
      </div>
    </div>
  );
}

export default TokenLoader;
