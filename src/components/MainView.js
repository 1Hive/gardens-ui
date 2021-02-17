import React from 'react'
import { GU, Root, ScrollView, useViewport } from '@1hive/1hive-ui'

import Footer from './Footer'
import Header from './Header/Header'
import Layout from './Layout'

function MainView({ children }) {
  const { below } = useViewport()
  const compactMode = below('large')

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <Root.Provider
        css={`
          flex-grow: 1;
          height: 100%;
          position: relative;
        `}
      >
        <div
          css={`
            flex-shrink: 0;
          `}
        >
          <Header />
        </div>
        <ScrollView>
          <div
            css={`
              min-height: 100vh;
              margin: 0;
              display: grid;
              grid-template-rows: 1fr ${compactMode ? 'auto' : `${40 * GU}px`};
            `}
          >
            <div
              css={`
                margin-bottom: ${(compactMode ? 3 : 0) * GU}px;
              `}
            >
              <Layout paddingBottom={3 * GU}>{children}</Layout>
            </div>
            <Footer />
          </div>
        </ScrollView>
      </Root.Provider>
    </div>
  )
}

export default MainView
