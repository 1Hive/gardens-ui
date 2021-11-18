import React from 'react'
import { useLocation } from 'react-router'
import { GU, Root, ScrollView, ToastHub, useViewport } from '@1hive/1hive-ui'

import Footer from './Garden/Footer'
import Header from './Header/Header'
import Layout from './Layout'
import GlobalPreferences from './Garden/Preferences/GlobalPreferences'
import Sidebar from './Sidebar/Sidebar'
import usePreferences from '@hooks/usePreferences'
import { useGardens } from '@/providers/Gardens'
import { useGardenState } from '@/providers/GardenState'

function MainView({ children }) {
  const { pathname } = useLocation()
  const { below } = useViewport()
  const { connectedGarden } = useGardens()

  const [openPreferences, closePreferences, preferenceOption] = usePreferences()

  let loadingGardenState = true
  if (connectedGarden) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading } = useGardenState()
    loadingGardenState = loading
  }

  const mobileMode = below('medium')
  const compactMode = below('large')

  if (preferenceOption) {
    return (
      <GlobalPreferences
        path={preferenceOption}
        onScreenChange={openPreferences}
        onClose={closePreferences}
      />
    )
  }

  return (
    <ToastHub
      threshold={1}
      timeout={1500}
      css={`
      & > div {
        width: auto;
        & > div {
          rgba(33, 43, 54, 0.9);
          border-radius: 16px;
        }
      }
    `}
    >
      <div css="display: flex">
        {pathname !== '/home' && !below('medium') && <Sidebar />}
        <div
          css={`
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
          `}
        >
          <Root.Provider
            css={`
              flex-grow: 1;
              height: 100%;
              position: relative;
              ${connectedGarden && !mobileMode && `margin-left: ${9 * GU}px;`}
            `}
          >
            <div
              css={`
                flex-shrink: 0;
              `}
            >
              <Header onOpenPreferences={openPreferences} />
            </div>
            <ScrollView>
              <div
                css={`
                  min-height: 100vh;
                  margin: 0;
                  display: grid;
                  grid-template-rows: 1fr auto;
                `}
              >
                <div
                  css={`
                    margin-bottom: ${(compactMode ? 3 : 0) * GU}px;
                  `}
                >
                  <Layout paddingBottom={3 * GU}>{children}</Layout>
                </div>
                {connectedGarden ? (
                  !loadingGardenState && <Footer />
                ) : (
                  <Footer />
                )}
              </div>
            </ScrollView>
          </Root.Provider>
        </div>
      </div>
    </ToastHub>
  )
}

export default MainView
