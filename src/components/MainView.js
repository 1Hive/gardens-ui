import React from 'react'
import { GU, useViewport } from '@1hive/1hive-ui'

import Footer from './Footer'
import Header from './Header'
import Layout from './Layout'

function MainView({ children }) {
  const { below } = useViewport()
  const compactMode = below('medium')

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <Header compact={compactMode} />

      <div
        css={`
          ${!compactMode && `transform: translateY(-${4 * GU}px);`}
          flex: 1 0 auto;
        `}
      >
        <div
          css={`
            height: 100%;
          `}
        >
          <Layout>{children}</Layout>
        </div>
        <Footer compact={compactMode} />
      </div>
    </div>
  )
}

export default MainView
