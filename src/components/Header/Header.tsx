import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  ButtonBase,
  GU,
  IconMenu,
  Link,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import AccountModule from '../Account/AccountModule'
import ActivityButton from '../Activity/ActivityButton'
import BalanceModule from '../BalanceModule'
import GlobalPreferencesButton from '../Garden/Preferences/GlobalPreferencesButton'
import Layout from '../Layout'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useWallet } from '@providers/Wallet'

import { buildGardenPath } from '@utils/routing-utils'
import { CELESTE_URL, getDexTradeTokenUrl } from '@/endpoints'

function Header({
  onOpenPreferences,
  onToggleSidebar,
}: {
  onOpenPreferences: any
  onToggleSidebar: any
}) {
  const theme = useTheme()
  const router = useRouter()
  const connectedGarden = useConnectedGarden()
  const { below } = useViewport()
  const { account } = useWallet()

  const mobileMode = below('medium')

  const { logo, logotype } = useMemo(() => {
    if (!connectedGarden) {
      return {
        logo: '/icons/base/gardensLogoMark.svg',
        logotype: '/icons/base/gardensLogoType.svg',
      }
    }

    return {
      logo: connectedGarden?.logo || '/icons/base/defaultGardenLogo.png',
      logotype:
        connectedGarden?.logo_type || '/icons/base/defaultGardenLogo.png',
    }
  }, [connectedGarden])

  const Logo = <img src={logo} height={mobileMode ? 40 : 60} alt="" />
  const logoLink = connectedGarden ? buildGardenPath(router, '') : '/home'

  const showBalance = connectedGarden && account && !mobileMode
  const showMenu = router.pathname !== '/home' && mobileMode

  return (
    <header
      css={`
        position: relative;
        z-index: 1;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <Layout paddingBottom={0}>
        <div
          css={`
            height: ${8 * GU}px;
            display: flex;
            align-items: center;
          `}
        >
          {showMenu && (
            <div
              css={`
                width: 88px;
                border-right: 1px solid ${theme.border};
                display: flex;
                align-self: stretch;
                justify-content: center;
                align-items: center;
              `}
            >
              <ButtonBase
                onClick={onToggleSidebar}
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <IconMenu
                  color="grey"
                  css={`
                    width: ${4 * GU}px;
                    height: ${4 * GU}px;
                  `}
                />
              </ButtonBase>
            </div>
          )}
          <div
            css={`
              width: 100%;
              margin: 0 ${3 * GU}px;
              display: flex;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <Link
                href={logoLink}
                external={false}
                css={`
                  display: flex;
                `}
              >
                {mobileMode ? (
                  Logo
                ) : (
                  <img
                    src={logotype}
                    height={connectedGarden ? 40 : 38}
                    alt=""
                  />
                )}
              </Link>
              {!mobileMode && (
                <nav
                  css={`
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin-left: ${6.5 * GU}px;
                  `}
                >
                  {connectedGarden && (
                    <GardenNavItems garden={connectedGarden} />
                  )}
                  {!connectedGarden && (
                    <Link
                      href={CELESTE_URL}
                      css={`
                        text-decoration: none;
                        color: ${theme.contentSecondary};
                      `}
                    >
                      Become a Keeper
                    </Link>
                  )}
                </nav>
              )}
            </div>

            <div
              css={`
                height: 100%;
                display: flex;
                align-items: center;
                ${showBalance && `min-width: ${42.5 * GU}px`};
              `}
            >
              <AccountModule compact={mobileMode} />
              {showBalance && (
                <>
                  <div
                    css={`
                      width: 0.5px;
                      height: ${3.5 * GU}px;
                      border-left: 0.5px solid ${theme.border};
                    `}
                  />
                  <BalanceModule />
                </>
              )}
              {connectedGarden && (
                <div
                  css={`
                    display: flex;
                    height: 100%;
                    margin-left: ${2 * GU}px;
                  `}
                >
                  <GlobalPreferencesButton onOpen={onOpenPreferences} />
                </div>
              )}
              {connectedGarden && account && (
                <div
                  css={`
                    display: flex;
                    height: 100%;
                  `}
                >
                  <ActivityButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </header>
  )
}

type GardenNavItemsProps = {
  garden: {
    wrappableToken: any
    token: any
    wiki: any
    forumURL: string
    getTokenLink: string
  }
}

function GardenNavItems({ garden }: GardenNavItemsProps) {
  const theme = useTheme()
  const router = useRouter()
  const token = garden.wrappableToken || garden.token
  const forumURL = garden.forumURL
  const { preferredNetwork } = useWallet()

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(router, 'covenant')
    router.push(path)
  }, [router])

  const getTokenLink = useMemo(
    () =>
      garden?.getTokenLink || getDexTradeTokenUrl(preferredNetwork, token.id),
    [garden]
  )

  return (
    <>
      <Button label="Covenant" onClick={handleOnGoToCovenant} mode="strong" />
      <Link
        href={forumURL}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Forum
      </Link>
      <Link
        href={getTokenLink}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Get {token.symbol}
      </Link>
      {garden?.wiki && (
        <Link
          href={garden.wiki}
          css={`
            text-decoration: none;
            color: ${theme.contentSecondary};
            margin-left: ${4 * GU}px;
          `}
        >
          Wiki
        </Link>
      )}
    </>
  )
}

export default Header
