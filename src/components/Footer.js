import React, { useState } from 'react'
import {
  ButtonBase,
  GU,
  Link as AragonLink,
  textStyle,
  useLayout,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import styled from 'styled-components'
import Layout from './Layout'
import MultiModal from '../components/MultiModal/MultiModal'
import CreateProposalScreens from '../components/ModalFlows/CreateProposalScreens/CreateProposalScreens'
import logoSvg from '../assets/logo.svg'

import { useWallet } from '../providers/Wallet'
import { HONEYSWAP_TRADE_HONEY } from '../endpoints'

import createSvg from '../assets/create.svg'
import getHoneySvg from '../assets/getHoney.svg'
import homeSvg from '../assets/home.svg'

function Footer() {
  const theme = useTheme()
  const { below } = useViewport()
  const compactMode = below('large')

  return (
    <footer
      css={`
        flex-shrink: 0;
        width: 100%;
        padding: ${5 * GU}px ${3 * GU}px;
        background: ${theme.surface};
      `}
    >
      <Layout paddingBottom={0}>
        {compactMode ? (
          <FixedFooter />
        ) : (
          <div
            css={`
              display: grid;
              grid-template-columns: ${40 * GU}px ${25 * GU}px ${25 * GU}px;
              grid-row-gap: ${2 * GU}px;

              & a {
                color: ${theme.contentSecondary};
              }
            `}
          >
            <div>
              <img src={logoSvg} height="40" alt="" />
            </div>
            <div>
              <h5
                css={`
                  ${textStyle('body1')};
                  margin-bottom: ${1.5 * GU}px;
                `}
              >
                Community
              </h5>
              <Link href="https://discord.gg/4fm7pgB" external>
                Discord
              </Link>
              <Link href="https://github.com/1Hive" external>
                Github
              </Link>
              <Link href="https://twitter.com/1HiveOrg" external>
                Twitter
              </Link>
              <Link href="https://t.me/honeyswapdex" external>
                Telegram
              </Link>
              <Link href="https://forum.1hive.org/" external>
                Forum
              </Link>
            </div>
            <div>
              <h5
                css={`
                  ${textStyle('body1')};
                  margin-bottom: ${1.5 * GU}px;
                `}
              >
                Documentation
              </h5>
              <Link href="https://1hive.gitbook.io/1hive/" external>
                Wiki
              </Link>
              <Link
                href="https://1hive.gitbook.io/1hive/community/security/bug-bounty"
                external
              >
                Bug Bounty
              </Link>
              <Link href="https://1hive.gitbook.io/1hive/guides/faq" external>
                FAQs
              </Link>
            </div>
          </div>
        )}
      </Layout>
    </footer>
  )
}

function FixedFooter() {
  const theme = useTheme()
  const { account } = useWallet()
  const { layoutName } = useLayout()
  const [createProposalModalVisible, setCreateProposalModalVisible] = useState(
    false
  )

  // TODO: Add the create proposal modal here
  return (
    <div>
      <div
        css={`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        `}
      >
        <div
          css={`
            padding: 0 ${3 * GU}px;
            background: white;
            border-top: 1px solid ${theme.border};
          `}
        >
          <div
            css={`
              margin: 0 ${3 * GU}px;
              display: flex;
              align-items: center;
              justify-content: ${layoutName === 'medium'
                ? 'space-between'
                : 'space-around'};
            `}
          >
            <FooterItem
              href="#/home"
              icon={<img src={homeSvg} alt="home" />}
              label="Home"
            />
            <FooterItem
              disabled={!account}
              icon={<img src={createSvg} alt="create" />}
              label="Create"
              onClick={() => setCreateProposalModalVisible(true)}
            />
            <FooterItem
              href={HONEYSWAP_TRADE_HONEY}
              icon={<img src={getHoneySvg} alt="gethoney" />}
              label="Get Honey"
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
  )
}

function FooterItem({
  disabled = false,
  external = false,
  href,
  icon,
  label,
  onClick,
}) {
  const theme = useTheme()
  return (
    <ButtonBase
      onClick={onClick}
      href={href}
      external={external}
      disabled={disabled}
      css={`
        padding: ${1 * GU}px ${2 * GU}px;
        border-radius: 0;

        ${!disabled &&
          `&:active {
          background: ${theme.surfacePressed};
          }`}
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: ${0.5 * GU}px;
        `}
      >
        {icon}
        <span
          css={`
            color: ${theme.contentSecondary};
            ${textStyle('body4')};
            line-height: 1;
            display: block;
          `}
        >
          {label}
        </span>
      </div>
    </ButtonBase>
  )
}

// TODO: Move to 1hive-ui
const Link = styled(AragonLink)`
  display: block;
  margin-bottom: ${1.5 * GU}px;
  text-align: left;
  text-decoration: none;
`

export default Footer
