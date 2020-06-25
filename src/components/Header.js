import React from 'react'
import { GU, Layout, useViewport } from '@aragon/ui'
import AccountModule from './Account/AccountModule'
import { BREAKPOINTS } from '../styles/breakpoints'

import beeSvg from '../assets/bee.svg'
import headerBackgroundSvg from '../assets/header-background.svg'
import logoSvg from '../assets/logotext.svg'

function Header() {
  const { width: vw } = useViewport()

  return (
    <header
      css={`
        background: rgba(124, 224, 214, 0.6);
      `}
    >
      <div
        css={`
          background: url(${headerBackgroundSvg}) no-repeat;
          background-size: 811px 600px;
          background-position: center;
          padding: ${10 * GU}px 0;
        `}
      >
        <Layout breakpoints={BREAKPOINTS} parentWidth={vw} paddingBottom={0}>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <div
              css={`
                width: ${25 * GU}px;
              `}
            >
              <img src={logoSvg} height="30" alt="" />
            </div>
            <div>
              <img src={beeSvg} height="60" alt="" />
            </div>
            <div
              css={`
                width: ${25 * GU}px;
              `}
            >
              <AccountModule />
            </div>
          </div>
        </Layout>
      </div>
    </header>
  )
}

export default Header
