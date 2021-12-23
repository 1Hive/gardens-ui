import React from 'react'

import { Layout, useViewport } from '@1hive/1hive-ui'

import { BREAKPOINTS } from '@/style/breakpoints'

type CustomLayoutProps = {
  children: React.ReactNode
  paddingBottom?: number
}

function CustomLayout({ children, paddingBottom = 0 }: CustomLayoutProps) {
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
