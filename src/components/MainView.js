import React from 'react'
import { GU, Root, ScrollView, useViewport } from '@1hive/1hive-ui'

import Footer from './Footer'
import Header from './Header/Header'
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
      <div
        css={`
          flex-shrink: 0;
        `}
      >
        <Header compact={compactMode} />
      </div>
      <Root.Provider
        css={`
          flex-grow: 1;
          height: 100%;
          position: relative;
        `}
      >
        <ScrollView>
          <div
            css={`
              min-height: 100vh;
              margin: 0;
              display: grid;
              grid-template-rows: 1fr ${compactMode
                  ? `${60 * GU}px`
                  : `${40 * GU}px`};
            `}
          >
            <div
              css={`
                flex: 1 0 auto;
              `}
            >
              <Layout>{children}</Layout>
            </div>
            <Footer compact={compactMode} />
          </div>
        </ScrollView>
      </Root.Provider>
    </div>
  )
}

export default MainView
