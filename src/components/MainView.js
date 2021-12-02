import React, { useCallback, useState } from 'react'
import { useLocation } from 'react-router'
import { GU, Root, ScrollView, ToastHub, useViewport } from '@1hive/1hive-ui'

import Footer from './Garden/Footer'
import Header from './Header/Header'
import Layout from './Layout'
import GlobalPreferences from './Garden/Preferences/GlobalPreferences'
import Sidebar from './Sidebar/Sidebar'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@providers/GardenState'
import usePreferences from '@hooks/usePreferences'

function MainView({ children }) {
  const { pathname } = useLocation()
  const { below } = useViewport()
  const connectedGarden = useConnectedGarden()
  const [openPreferences, closePreferences, preferenceOption] = usePreferences()
  const mobileMode = below('medium')
  const compactMode = below('large')
  const [showSidebar, setShowSidebar] = useState(!mobileMode)
  let loadingGardenState = true

  const handleToggleSidebar = useCallback(() => {
    setShowSidebar(prevShowSidebar => (!mobileMode ? true : !prevShowSidebar))
  }, [mobileMode])

  if (connectedGarden) {
    // TODO: Refactor
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading } = useGardenState()
    loadingGardenState = loading
  }

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
        {pathname !== '/home' && (
          <Sidebar show={showSidebar} onToggle={handleToggleSidebar} />
        )}
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
              ${connectedGarden && !mobileMode
                ? `margin-left: ${9 * GU}px;`
                : ''}
            `}
          >
            <div
              css={`
                flex-shrink: 0;
              `}
            >
              <Header
                onOpenPreferences={openPreferences}
                onToggleSidebar={handleToggleSidebar}
              />
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
