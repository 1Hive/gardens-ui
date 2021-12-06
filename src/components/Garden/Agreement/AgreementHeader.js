/** @jsx jsx */
import React from 'react';
import { IconCheck, Tag, textStyle, useLayout, GU, useTheme } from '@1hive/1hive-ui';
import icon from './assets/icon.svg';
import { css, jsx } from '@emotion/react';

function AgreementHeader({ title }) {
  const theme = useTheme();
  const { layoutName } = useLayout();

  const compactMode = layoutName === 'small';

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-bottom: ${compactMode ? 4 * GU : 5 * GU}px;
      `}
    >
      {!compactMode && <DecorativeIcon />}
      <div
        css={css`
          display: flex;
          flex: 1;
          justify-content: space-between;
        `}
      >
        <div>
          <h2
            css={css`
              ${compactMode ? textStyle('title3') : textStyle('title2')};
              margin-bottom: ${0.75 * GU}px;
            `}
          >
            {title}
          </h2>
          <div
            css={css`
              display: flex;
            `}
          >
            <Tag
              icon={<IconCheck size="small" />}
              label="Active"
              color={`${theme.positive.toString()}`}
              background={`${theme.positiveSurface.toString()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DecorativeIcon() {
  return (
    <div
      css={css`
        position: relative;
        overflow: hidden;
        border-radius: 100%;
        background-color: #5f64ff;
        flex-shrink: 0;
        margin-right: ${2 * GU}px;
      `}
    >
      <img
        src={icon}
        alt=""
        width={8.75 * GU}
        height={8.75 * GU}
        css={css`
          display: block;
        `}
      />
    </div>
  );
}

export default AgreementHeader;
