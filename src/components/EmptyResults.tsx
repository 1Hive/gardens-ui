/** @jsx jsx */
import React from 'react';
import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui';
import defaultGardenLogo from '@assets/defaultGardenLogo.png';
import { css, jsx } from '@emotion/react';
import styled from 'styled-components';

const ParagraphWrapper = styled.div<{
  background;
  compactMode;
}>`
  ${textStyle('body2')};
  color: ${props => props.background};
  margin-top: ${1.5 * GU}px;
  width: ${props => (props.compactMode ? 25 : 55) * GU}px;
  display: flex;
  text-align: center;
`;

export default function EmptyResults({
  image = defaultGardenLogo,
  title,
  paragraph,
}: {
  image?: string;
  title: string;
  paragraph?: string;
}) {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const compactMode = layoutName === 'small';

  return (
    <Box>
      <div
        css={css`
          margin: ${(compactMode ? 0 : 9) * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={image}
          alt=""
          css={css`
            display: block;
            width: 100px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />
        <span
          css={css`
            ${textStyle(compactMode ? 'title4' : 'title2')};
            text-align: center;
          `}
        >
          {title}
        </span>
        <ParagraphWrapper background={theme.surfaceContentSecondary.toString()} compactMode={compactMode}>
          {paragraph}
        </ParagraphWrapper>
      </div>
    </Box>
  );
}
