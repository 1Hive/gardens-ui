import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { Button, GU, Link, useTheme, useViewport } from "@1hive/1hive-ui";
import AccountModule from "../Account/AccountModule";
import ActivityButton from "../Activity/ActivityButton";
import BalanceModule from "../BalanceModule";
import GlobalPreferencesButton from "../Garden/Preferences/GlobalPreferencesButton";
import Layout from "../Layout";
import { useConnectedGarden } from "@providers/ConnectedGarden";
import { useWallet } from "@providers/Wallet";

import { buildGardenPath } from "@utils/routing-utils";
import { getDexTradeTokenUrl } from "../../endpoints";
import { getNetwork } from "../../networks";

import defaultGardenLogo from "@assets/defaultGardenLogo.png";
import gardensLogo from "@assets/gardensLogoMark.svg";
import gardensLogoType from "@assets/gardensLogoType.svg";
import { css, jsx } from "@emotion/react";

import { HeaderContainer } from "./index.styled";

function Header({ onOpenPreferences }) {
  const theme = useTheme();
  const { account } = useWallet();
  const { below } = useViewport();
  const layoutSmall = below("medium");
  const network = getNetwork();
  const history = useHistory();
  const connectedGarden = useConnectedGarden();

  const { logo, logotype } = useMemo(() => {
    if (!connectedGarden) {
      return { logo: gardensLogo, logotype: gardensLogoType };
    }

    return {
      logo: connectedGarden?.logo || defaultGardenLogo,
      logotype: connectedGarden?.logo_type || defaultGardenLogo,
    };
  }, [connectedGarden]);

  const Logo = <img src={logo} height={layoutSmall ? 40 : 60} alt="" />;
  const logoLink = `#${
    connectedGarden ? buildGardenPath(history.location, "") : "/home"
  }`;

  const showBalance = connectedGarden && account && !layoutSmall;

  return (
    <HeaderContainer>
      <Layout paddingBottom={0}>
        <div
          css={css`
            height: ${8 * GU}px;
            margin: 0 ${3 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <Link
              href={logoLink}
              external={false}
              style={{
                display: "flex",
              }}
            >
              {layoutSmall ? (
                Logo
              ) : (
                <img src={logotype} height={connectedGarden ? 40 : 38} alt="" />
              )}
            </Link>
            {!below("medium") && (
              <nav
                css={css`
                  display: flex;
                  align-items: center;
                  height: 100%;
                  margin-left: ${6.5 * GU}px;
                `}
              >
                {connectedGarden && <GardenNavItems garden={connectedGarden} />}
                {!connectedGarden && (
                  <Link
                    href={network.celesteUrl}
                    style={{
                      color: theme.contentSecondary.toString(),
                      textDecoration: "none",
                    }}
                  >
                    Become a Keeper
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div
            css={css`
              height: 100%;
              display: flex;
              align-items: center;
              ${showBalance && `min-width: ${42.5 * GU}px`};
            `}
          >
            <AccountModule compact={layoutSmall} />
            {showBalance && (
              <React.Fragment>
                <div
                  css={css`
                    width: 0.5px;
                    height: ${3.5 * GU}px;
                    border-left: 0.5px solid ${theme.border.toString()};
                  `}
                />
                <BalanceModule />
              </React.Fragment>
            )}
            {connectedGarden && (
              <div
                css={css`
                  display: flex;
                  height: 100%;
                  margin-left: ${2 * GU}px;
                `}
              >
                <GlobalPreferencesButton onOpen={onOpenPreferences} />
              </div>
            )}
            {account && (
              <div
                css={css`
                  display: flex;
                  height: 100%;
                `}
              >
                <ActivityButton />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </HeaderContainer>
  );
}

function GardenNavItems({ garden }) {
  const theme = useTheme();
  const history = useHistory();
  const token = garden.wrappableToken || garden.token;
  const connectedGarden = useConnectedGarden();
  const forumURL = connectedGarden.forumURL;
  const { preferredNetwork } = useWallet();

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(history.location, "covenant");
    history.push(path);
  }, [history]);

  return (
    <React.Fragment>
      <Button label="Covenant" onClick={handleOnGoToCovenant} mode="strong" />
      <Link
        href={forumURL}
        style={{
          textDecoration: "none",
          color: theme.contentSecondary.toString(),
          marginLeft: `${4 * GU}px`,
        }}
      >
        Forum
      </Link>
      <Link
        href={getDexTradeTokenUrl(preferredNetwork, token.id)}
        style={{
          color: theme.contentSecondary.toString(),
          textDecoration: "none",
          marginLeft: `${4 * GU}px`,
        }}
      >
        Get {token.symbol}
      </Link>
      {garden?.wiki && (
        <Link
          href={garden.wiki}
          style={{
            color: theme.contentSecondary.toString(),
            textDecoration: "none",
            marginLeft: `${4 * GU}px`,
          }}
        >
          Wiki
        </Link>
      )}
    </React.Fragment>
  );
}

export default Header;
