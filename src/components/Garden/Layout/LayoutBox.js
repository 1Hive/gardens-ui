/** @jsx jsx */
import React, { useMemo } from 'react';
import { Box, useLayout, GU, useTheme } from '@1hive/1hive-ui';
import { css, jsx } from '@emotion/react';

function LayoutBox({ children, heading, primary, mode, ...props }) {
  const { layoutName } = useLayout();
  const theme = useTheme();
  const compactMode = layoutName === 'small';

  const { backgroundColor, borderColor } = useMemo(() => {
    const attributes = {
      warning: {
        backgroundColor: '#fefdfb',
        borderColor: theme.warning.toString(),
      },
      negative: {
        backgroundColor: '#FFFAFA',
        borderColor: '#FF7C7C',
      },
      disabled: {
        backgroundColor: theme.surfacePressed.toString(),
        borderColor: theme.border.toString(),
      },
    };

    return attributes[mode] || {};
  }, [theme, mode]);

  const primaryHeading = (
    <span
      css={css`
        padding: 0 ${2 * GU}px;
      `}
    >
      {heading}
    </span>
  );

  return (
    <Box
      {...props}
      heading={heading && primary ? primaryHeading : heading}
      padding={compactMode ? 2 * GU : primary && 5 * GU}
      css={css`
        ${backgroundColor ? `background-color: ${backgroundColor};` : ''}
        ${borderColor ? `border-color: ${borderColor};` : ''}
      `}
    >
      {children}
    </Box>
  );
}

export default LayoutBox;
