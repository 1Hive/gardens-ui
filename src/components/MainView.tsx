import React from "react";
import { useLocation } from "react-router";
import { GU, Root, ScrollView, ToastHub, useViewport } from "@1hive/1hive-ui";

import Footer from "./Garden/Footer";
import Header from "./Header/Header";
import Layout from "./Layout";
import GlobalPreferences from "./Garden/Preferences/GlobalPreferences";
import Sidebar from "./Sidebar/Sidebar";
import { useConnectedGarden } from "@providers/ConnectedGarden";
import { useGardenState } from "@providers/GardenState";
import usePreferences from "@hooks/usePreferences";

import { css, jsx } from "@emotion/react";

function MainView({ children }) {
  const { pathname } = useLocation();
  const { below } = useViewport();
  const connectedGarden = useConnectedGarden();

  const [
    openPreferences,
    closePreferences,
    preferenceOption,
  ] = usePreferences();

  let loadingGardenState = true;
  if (connectedGarden) {
    // TODO: Refactor
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading } = useGardenState();
    loadingGardenState = loading;
  }

  const mobileMode = below("medium");
  const compactMode = below("large");

  if (preferenceOption) {
    return (
      <GlobalPreferences
        path={preferenceOption}
        onScreenChange={openPreferences}
        onClose={closePreferences}
      />
    );
  }

  return (
    <ToastHub
      threshold={1}
      timeout={1500}
      css={css`
      & > div {
        width: auto;
        & > div {
          rgba(33, 43, 54, 0.9);
          border-radius: 16px;
        }
      }
    `}
    >
      <div
        css={css`
          display: flex;
        `}
      >
        {pathname !== "/home" && !below("medium") && <Sidebar />}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
          `}
        >
          <Root.Provider
            css={css`
              flex-grow: 1;
              height: 100%;
              position: relative;
              ${connectedGarden && !mobileMode && `margin-left: ${9 * GU}px;`}
            `}
          >
            <div
              css={css`
                flex-shrink: 0;
              `}
            >
              <Header onOpenPreferences={openPreferences} />
            </div>
            <ScrollView>
              <div
                css={css`
                  min-height: 100vh;
                  margin: 0;
                  display: grid;
                  grid-template-rows: 1fr auto;
                `}
              >
                <div
                  css={css`
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
  );
}

export default MainView;
