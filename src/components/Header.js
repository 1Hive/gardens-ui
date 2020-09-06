import React from 'react'
import { GU } from '@1hive/1hive-ui'
import AccountModule from './Account/AccountModule'

import beeSvg from '../assets/bee.svg'
import logoSvg from '../assets/logotext.svg'

function Header({ compact }) {
  const BeeIcon = <img src={beeSvg} height={compact ? 40 : 60} alt="" />
  const headerItemsWidth = compact ? 'auto' : 25 * GU

  return (
    <header
      css={`
        background: rgba(124, 224, 214, 0.6);
        margin-bottom: ${compact ? `${2 * GU}px` : 0};
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div
          css={`
            width: ${headerItemsWidth}px;
          `}
        >
          {compact ? BeeIcon : <img src={logoSvg} height="30" alt="" />}
        </div>
        {!compact && <div>{BeeIcon}</div>}
        <div
          css={`
            width: ${headerItemsWidth}px;
          `}
        >
          <AccountModule compact={compact} />
        </div>
      </div>
    </header>
  )
}

export default Header
