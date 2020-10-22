import React from 'react'
import { Layout, useViewport } from '@1hive/1hive-ui'
import { BREAKPOINTS } from '../styles/breakpoints'

function CustomLayout({ children, paddingBottom = 0 }) {
  const { width: vw } = useViewport()
  return (
    <Layout
      breakpoints={BREAKPOINTS}
      parentWidth={vw}
      paddingBottom={paddingBottom}
      css={`
        ${vw < BREAKPOINTS.large && `width: auto;`}
        min-width: auto;
      `}
    >
      {children}
    </Layout>
  )
}

export default CustomLayout
