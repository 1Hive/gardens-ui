import React, { useMemo } from 'react'
import { GU, Link, useTheme, useViewport } from '@1hive/1hive-ui'
import AccountModule from '../Account/AccountModule'
import BalanceModule from '../BalanceModule'
import Layout from '../Layout'
import { useGardens } from '../../providers/Gardens'
import { useWallet } from '../../providers/Wallet'
import { getHoneyswapTradeTokenUrl } from '../../endpoints'
import { getNetwork } from '../../networks'

import defaultGardenLogo from '../../assets/defaultGardenLogo.svg'
import gardensLogo from '../../assets/gardensLogo.svg'
import gardensLogoType from '../../assets/gardensLogoType.svg'

function Header() {
  const theme = useTheme()
  const { account } = useWallet()
  const { below } = useViewport()
  const layoutSmall = below('medium')
  const network = getNetwork()
  const { connectedGarden } = useGardens()

  const { logo, logotype } = useMemo(() => {
    if (!connectedGarden) {
      return { logo: gardensLogo, logotype: gardensLogoType }
    }

    return {
      logo: connectedGarden?.logo || defaultGardenLogo,
      logotype: connectedGarden?.logo_type || defaultGardenLogo,
    }
  }, [connectedGarden])

  const Logo = <img src={logo} height={layoutSmall ? 40 : 60} alt="" />

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
            margin: 0 ${3 * GU}px;
            display: flex;
            align-items: center;
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
              href="#/home"
              external={false}
              css={`
                display: flex;
              `}
            >
              {layoutSmall ? Logo : <img src={logotype} height="40" alt="" />}
            </Link>
            {!below('large') && (
              <nav
                css={`
                  display: flex;
                  align-items: center;

                  height: 100%;
                  margin-left: ${6.5 * GU}px;
                `}
              >
                {connectedGarden && <GardenNavItems garden={connectedGarden} />}
                <Link
                  href={network.celesteUrl}
                  css={`
                    text-decoration: none;
                    color: ${theme.contentSecondary};
                    margin-left: ${(connectedGarden ? 4 : 0) * GU}px;
                  `}
                >
                  Stake Honey
                </Link>
              </nav>
            )}
          </div>

          <div
            css={`
              display: flex;
              align-items: center;
              ${account &&
                connectedGarden &&
                !layoutSmall &&
                `min-width: ${42.5 * GU}px`};
            `}
          >
            <AccountModule compact={layoutSmall} />
            {/** TODO re arrange the header when the balance module is not present because of not having a connected dao  also we should hide the collateral manager option */}
            {connectedGarden && account && !layoutSmall && (
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
          </div>
        </div>
      </Layout>
    </header>
  )
}

function GardenNavItems({ garden }) {
  const theme = useTheme()

  return (
    <>
      <Link
        href={`#/garden/${garden.address}/covenant`}
        external={false}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
        `}
      >
        Covenant
      </Link>
      <Link
        href={getHoneyswapTradeTokenUrl(garden.token.id)}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Get {garden.token.name}
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
