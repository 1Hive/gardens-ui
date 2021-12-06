import React from 'react';
import { Layout, useViewport } from '@1hive/1hive-ui';
import { BREAKPOINTS } from '@/style/breakpoints';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function CustomLayout({ children, paddingBottom = 0 }) {
  const { width: vw } = useViewport();
  return (
    <Layout
      breakpoints={BREAKPOINTS}
      parentWidth={vw}
      paddingBottom={paddingBottom}
      css={css`
        ${vw < BREAKPOINTS.large && `width: auto;`}
        min-width: auto;
      `}
    >
      {children}
    </Layout>
  );
}

export default CustomLayout;
