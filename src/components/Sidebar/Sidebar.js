import React, { useMemo } from "react";
import { useRouteMatch } from "react-router";
import { useTrail, animated } from "react-spring";
import { GU, Link, useTheme } from "@1hive/1hive-ui";
import LoadingRing from "../LoadingRing";
import MenuItem from "./MenuItem";
import { useGardens } from "@providers/Gardens";
import { useUserState } from "@providers/User";

import { addressesEqual } from "@utils/web3-utils";
import gardensLogo from "@assets/gardensLogoMark.svg";
import defaultGardenLogo from "@assets/defaultGardenLogo.png";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function Sidebar() {
  const theme = useTheme();
  const { user: connectedUser, loading: userLoading } = useUserState();
  const { gardensMetadata } = useGardens();

  const match = useRouteMatch("/garden/:daoId");

  const sidebarGardens = useMemo(() => {
    if (!connectedUser?.gardensSigned) {
      return [];
    }

    const result = connectedUser.gardensSigned.map((gardenSignedAddress) => {
      const { name, logo } =
        gardensMetadata?.find((g) =>
          addressesEqual(g.address, gardenSignedAddress)
        ) || {};

      return {
        address: gardenSignedAddress,
        name,
        path: `#/garden/${gardenSignedAddress}`,
        src: logo || defaultGardenLogo,
      };
    });

    return result;
  }, [connectedUser, gardensMetadata]);

  const startTrail = sidebarGardens.length > 0;
  const trail = useTrail(sidebarGardens.length, {
    config: { mass: 5, tension: 1500, friction: 150 },
    delay: 300,
    opacity: startTrail ? 1 : 0,
    marginLeft: startTrail ? "0" : "-40px",
    from: { marginLeft: "-40px", opacity: 0 },
  });

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 1;
        width: ${9 * GU}px;
        flex-shrink: 0;
        background: ${theme.surface.toString()};
        border-right: 1px solid ${theme.border.toString()};
        box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
      `}
    >
      <div
        css={css`
          padding: ${1.5 * GU}px ${2 * GU}px;
        `}
      >
        <div
          css={css`
            padding-bottom: ${1.5 * GU}px;
            border-bottom: 1px solid ${theme.border.toString()};
          `}
        >
          <Link href="#/home" external={false} style={{ display: "block" }}>
            <img
              src={gardensLogo}
              height={40}
              alt=""
              css={css`
                display: block;
              `}
            />
          </Link>
        </div>
      </div>

      <nav
        css={css`
          position: fixed;
          height: 100vh;
          overflow-y: scroll;
          width: 100%;
          pointer-events: none;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            position: absolute;
            pointer-events: auto;
          `}
        >
          {userLoading ? (
            <div
              css={css`
                margin-top: ${6 * GU}px;
                margin-left: ${2 * GU}px;
              `}
            >
              <LoadingRing mode="half-circle" />
            </div>
          ) : (
            <ul>
              {trail.map((style, index) => {
                const { address, name, path, src } = sidebarGardens[index];
                return (
                  <animated.div key={address} style={style}>
                    <MenuItem
                      active={addressesEqual(address, match?.params.daoId)}
                      label={name || address}
                      path={path}
                      src={src}
                    />
                  </animated.div>
                );
              })}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
