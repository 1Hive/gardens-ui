import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import {
  ButtonBase,
  GU,
  IconWrite,
  Link as AragonLink,
  textStyle,
  useLayout,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import styled from 'styled-components'
import Layout from '../Layout'
import MultiModal from '../MultiModal/MultiModal'
import CreateProposalScreens from './ModalFlows/CreateProposalScreens/CreateProposalScreens'
import { useGardens } from '@providers/Gardens'
import { useWallet } from '@providers/Wallet'

import { buildGardenPath } from '@utils/routing-utils'
import { getHoneyswapTradeTokenUrl } from '@/endpoints'

import createSvg from '@assets/create.svg'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import getHoneySvg from '@assets/getHoney.svg' // TODO: Update
import gardenSvg from '@assets/gardensLogoMark.svg'

function Footer() {
  const theme = useTheme()
  const { below } = useViewport()
  const compactMode = below('large')

  const { connectedGarden } = useGardens()
  if (!connectedGarden) {
    return null
  }

  const { links, logo, token, wrappableToken } = connectedGarden
  const logoSvg = logo || defaultGardenLogo

  return (
    <footer
      css={`
        flex-shrink: 0;
        width: 100%;
        padding: ${5 * GU}px ${3 * GU}px;
        background: ${theme.surface};
      `}
    >
      <Layout paddingBottom={40}>
        {compactMode ? (
          <FixedFooter token={wrappableToken || token} />
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
              <img src={logoSvg} height="60" alt="" />
            </div>
            {links?.community && (
              <div>
                <h5
                  css={`
                    ${textStyle('body1')};
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  Community
                </h5>
                {links.community.map((link, i) => {
                  return (
                    <Link key={i} href={link.link} external>
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            )}
            {links?.documentation && (
              <div>
                <h5
                  css={`
                    ${textStyle('body1')};
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  Documentation
                </h5>
                {links.documentation.map((link, i) => {
                  return (
                    <Link key={i} href={link.link} external>
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </Layout>
    </footer>
  )
}

function FixedFooter({ token }) {
  const theme = useTheme()
  const history = useHistory()
  const { account } = useWallet()
  const { layoutName } = useLayout()
  const [createProposalModalVisible, setCreateProposalModalVisible] = useState(
    false
  )

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(history.location, 'covenant')
    history.push(path)
  }, [history])

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
              icon={
                <img src={gardenSvg} alt="home" width="24px" height="24px" />
              }
              label="Home"
            />
            <FooterItem
              icon={
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    border-radius: 50px;
                    width: 24px;
                    height: 24px;
                    border: 2px solid ${theme.content};
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
              href={getHoneyswapTradeTokenUrl(token.id)}
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
