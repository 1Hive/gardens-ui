import React, { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router'
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
import { useAppTheme } from '@providers/AppTheme'

import { buildGardenPath } from '@utils/routing-utils'
import { CELESTE_URL, getDexTradeTokenUrl } from '@/endpoints'

import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import gardensLogo from '@assets/gardensLogoMark.svg'
import gardensLogoType from '@assets/gardensLogoType.svg'
import gardensLogoTypeDark from '@assets/dark-mode/gardensLogoTypeDark.svg'
import darkModeIconLight from '@assets/icon-dark-mode-light.svg'
import darkModeIconDark from '@assets/dark-mode/icon-dark-mode-dark.svg'

function Header({
  onOpenPreferences,
  onToggleSidebar,
}: {
  onOpenPreferences: any
  onToggleSidebar: any
}) {
  const theme = useTheme()
  const { pathname } = useLocation()
  const connectedGarden = useConnectedGarden()
  const { appearance, toggleAppearance } = useAppTheme()
  const history = useHistory()
  const { below } = useViewport()
  const { account } = useWallet()

  const mobileMode = below('medium')

  const { logo, logotype } = useMemo(() => {
    if (!connectedGarden) {
      return {
        logo: gardensLogo,
        logotype:
          appearance === 'light' ? gardensLogoType : gardensLogoTypeDark,
      }
    }

    const logotype =
      appearance === 'light'
        ? connectedGarden?.logo_type
        : connectedGarden?.logo_type_dark

    return {
      logo: connectedGarden?.logo || defaultGardenLogo,
      logotype: logotype || connectedGarden?.logo_type || defaultGardenLogo,
    }
  }, [connectedGarden, appearance])

  const Logo = <img src={logo} height={mobileMode ? 40 : 60} alt="" />
  const logoLink = `#${
    connectedGarden ? buildGardenPath(history.location, '') : '/home'
  }`

  const toggleDarkMode = useCallback(() => {
    toggleAppearance()
  }, [toggleAppearance])

  const showBalance = connectedGarden && account && !mobileMode
  const showMenu = pathname !== '/home' && mobileMode

  return (
    <header
      css={`
        position: relative;
        z-index: 1;
        background: ${theme.surface};
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
                justify-content: space-between;
                min-width: ${showBalance
                  ? 42.5 * GU
                  : mobileMode
                  ? 10 * GU
                  : 29 * GU}px;
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

              {!connectedGarden && (
                <ButtonBase
                  css={`
                    width: ${3 * GU}px;
                    height: ${3 * GU}px;
                  `}
                  onClick={toggleDarkMode}
                >
                  <img
                    css="width: 100%;"
                    src={
                      appearance === 'light'
                        ? darkModeIconLight
                        : darkModeIconDark
                    }
                  />
                </ButtonBase>
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
    getTokenDescription: string
  }
}

function GardenNavItems({ garden }: GardenNavItemsProps) {
  const theme = useTheme()
  const history = useHistory()
  const token = garden.wrappableToken || garden.token
  const forumURL = garden.forumURL
  const { preferredNetwork } = useWallet()

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(history.location, 'covenant')
    history.push(path)
  }, [history])

  const getTokenLink = useMemo(
    () =>
      garden?.getTokenLink || getDexTradeTokenUrl(preferredNetwork, token.id),
    [garden]
  )

  const getTokenDescription = useMemo(
    () => garden?.getTokenDescription || `Get ${token.symbol}`,
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
        {getTokenDescription}
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
