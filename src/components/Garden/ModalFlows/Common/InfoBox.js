import React from 'react';
import { Button, GU, Info, textStyle } from '@1hive/1hive-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function InfoBox({ data }) {
  return (
    <Info
      background={data.backgroundColor}
      borderColor="none"
      color={data.color.toString()}
      css={css`
        border-radius: ${0.5 * GU}px;
        margin-top: ${1.5 * GU}px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          ${textStyle('body2')};
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <img src={data.icon} width="18" height="18" />
          <span
            css={css`
              margin-left: ${1.5 * GU}px;
            `}
          >
            {data.text}
          </span>
        </div>
        {data.actionButton && (
          <div
            css={css`
              margin-left: ${1 * GU}px;
            `}
          >
            <Button
              css={css`
                border-radius: ${0.5 * GU}px;
              `}
              onClick={data.buttonOnClick}
            >
              {data.actionButton}
            </Button>
          </div>
        )}
      </div>
    </Info>
  );
}

export default InfoBox;
