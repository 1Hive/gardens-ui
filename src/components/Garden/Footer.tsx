/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  ButtonBase,
  GU,
  IconWrite,
  Link as AragonLink,
  textStyle,
  useLayout,
  useViewport,
  useTheme,
} from "@1hive/1hive-ui";
import Layout from "../Layout";
import MultiModal from "../MultiModal/MultiModal";
import CreateProposalScreens from "./ModalFlows/CreateProposalScreens/CreateProposalScreens";
import { useConnectedGarden } from "@providers/ConnectedGarden";
import { useWallet } from "@providers/Wallet";

import { buildGardenPath } from "@utils/routing-utils";
import { getDexTradeTokenUrl } from "../../endpoints";

import createSvg from "../../assets/create.svg";
import defaultGardenLogo from "@assets/defaultGardenLogo.png";
import getHoneySvg from "@assets/getHoney.svg"; // TODO: Update
import gardenSvg from "@assets/gardensLogoMark.svg";
import { css, jsx } from "@emotion/react";
import styled from "styled-components";

const defaultFooterData = {
  links: {
    community: [
      {
        label: "Discord",
        link: "https://discord.gg/4fm7pgB",
      },
      {
        label: "Github",
        link: "https://github.com/1hive/gardens",
      },
      {
        label: "Twitter",
        link: "https://twitter.com/gardensdao",
      },
      {
        label: "Website",
        link: "https://gardens.1hive.org/",
      },
    ],
    documentation: [
      {
        label: "Gitbook",
        link: "https://1hive.gitbook.io/gardens",
      },
    ],
  },
  logo: gardenSvg,
  garden: false,
  token: null,
  wrappableToken: null,
};

function Footer() {
  const theme = useTheme();
  const { below } = useViewport();
  const compactMode = below("medium");
  const [footerData, setFooterData] = useState(defaultFooterData);

  const connectedGarden = useConnectedGarden();

  useEffect(() => {
    if (connectedGarden) {
      // eslint-disable-next-line camelcase
      const { links, logo, token, wrappableToken } = connectedGarden;
      setFooterData({
        links,
        logo,
        token,
        wrappableToken,
        garden: true,
      });
    }
  }, [connectedGarden]);

  const logoSvg = footerData.logo || defaultGardenLogo;

  return (
    <footer
      css={css`
        flex-shrink: 0;
        width: 100%;
        padding: ${5 * GU}px ${3 * GU}px;
        background-color: ${theme.surface.toString()};
      `}
    >
      <Layout paddingBottom={40}>
        {compactMode ? (
          footerData.garden && (
            <FixedFooter
              token={footerData.wrappableToken || footerData.token}
            />
          )
        ) : (
          <div
            css={css`
              display: grid;
              grid-template-columns: ${40 * GU}px ${25 * GU}px ${25 * GU}px;
              grid-row-gap: ${2 * GU}px;

              & a {
                color: ${theme.contentSecondary.toString()};
              }
            `}
          >
            <div>
              <img
                css={css`
                  border-radius: 100%;
                `}
                src={logoSvg}
                height="60"
                alt=""
              />
            </div>
            {footerData.links?.community && (
              <div>
                <h5
                  css={css`
                    ${textStyle("body1")};
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  Community
                </h5>
                {footerData.links.community.map((link, i) => {
                  return (
                    <Link key={i} href={link.link} external>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
            {footerData.links?.documentation && (
              <div>
                <h5
                  css={css`
                    ${textStyle("body1")};
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  Documentation
                </h5>
                {footerData.links.documentation.map((link, i) => {
                  return (
                    <Link key={i} href={link.link} external>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Layout>
    </footer>
  );
}

function FixedFooter({ token }) {
  const theme = useTheme();
  const history = useHistory();
  const { account } = useWallet();
  const { layoutName } = useLayout();
  const { preferredNetwork } = useWallet();
  const [createProposalModalVisible, setCreateProposalModalVisible] = useState(
    false
  );

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(history.location, "covenant");
    history.push(path);
  }, [history]);

  // TODO: Add the create proposal modal here
  return (
    <div>
      <div
        css={css`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          margin-top: ${1.5 * GU}px;
        `}
      >
        <div
          css={css`
            padding: 0 ${3 * GU}px;
            background: white;
            border-top: 1px solid ${theme.border.toString()};
          `}
        >
          <div
            css={css`
              margin: 0 ${3 * GU}px;
              display: flex;
              align-items: center;
              justify-content: ${layoutName === "medium"
                ? "space-between"
                : "space-around"};
            `}
          >
            <FooterItem
              href="#/home"
              icon={
                <img src={gardenSvg} alt="home" width="24px" height="24px" />
              }
              label="Home"
            />
            <FooterItem
              icon={
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    width: 24px;
                    height: 24px;
                    border: 2px solid ${theme.content.toString()};
                  `}
                >
                  <IconWrite alt="covenant" />
                </div>
              }
              label="Covenant"
              onClick={handleOnGoToCovenant}
            />
            <FooterItem
              disabled={!account}
              icon={<img src={createSvg} alt="create" />}
              label="Create"
              onClick={() => setCreateProposalModalVisible(true)}
            />
            <FooterItem
              href={getDexTradeTokenUrl(preferredNetwork, token.id)}
              icon={<img src={getHoneySvg} alt="" />}
              label={`Get ${token.name}`}
              external
            />
          </div>
        </div>
      </div>
      <MultiModal
        visible={createProposalModalVisible}
        onClose={() => setCreateProposalModalVisible(false)}
      >
        <CreateProposalScreens />
      </MultiModal>
    </div>
  );
}

function FooterItem({
  disabled = false,
  external = false,
  href,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  external?: boolean;
  href?;
  icon;
  label: string;
  onClick?: () => void;
}) {
  const theme = useTheme();
  return (
    <ButtonBase
      onClick={onClick}
      href={href}
      external={external}
      disabled={disabled}
      css={css`
        padding: ${1 * GU}px ${2 * GU}px;
        border-radius: 0;

        ${!disabled &&
          `&:active {
          background: ${theme.surfacePressed.toString()};
        }`}
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: ${0.5 * GU}px;
        `}
      >
        {icon}
        <span
          css={css`
            color: ${theme.contentSecondary.toString()};
            ${textStyle("body4")};
            line-height: 1;
            display: block;
          `}
        >
          {label}
        </span>
      </div>
    </ButtonBase>
  );
}

// TODO: Move to 1hive-ui
const Link = styled(AragonLink)`
  display: block;
  margin-bottom: ${1.5 * GU}px;
  text-align: left;
  text-decoration: none;
`;

export default Footer;
