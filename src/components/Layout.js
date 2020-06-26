import React from 'react'
import { Layout, useViewport } from '@1hive/1hive-ui'
import { BREAKPOINTS } from '../styles/breakpoints'

function CustomLayout({ children }) {
  const { width: vw } = useViewport()
  return (
    <Layout breakpoints={BREAKPOINTS} parentWidth={vw} paddingBottom={0}>
      {children}
    </Layout>
  )
}

export default CustomLayout
