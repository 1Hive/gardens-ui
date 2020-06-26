import React from 'react'
import { GU, Layout, useViewport } from '@1hive/1hive-ui'

import Footer from './Footer'
import Header from './Header'
import { BREAKPOINTS } from '../styles/breakpoints'

function MainView({ children }) {
  const { width: vw, below } = useViewport()
  const compactMode = below('medium')

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <Header compactMode={compactMode} />

      <div
        css={`
          transform: translateY(-${4 * GU}px);
          flex: 1 0 auto;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            height: 100%;
          `}
        >
          <Layout breakpoints={BREAKPOINTS} parentWidth={vw} paddingBottom={0}>
            {children}
          </Layout>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default MainView
