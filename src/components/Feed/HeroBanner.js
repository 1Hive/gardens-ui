import React from 'react'
import { Button, GU, IconPlus, textStyle, useLayout } from '@1hive/1hive-ui'
import { useWallet } from '../../providers/Wallet'

import desktopBanner from '../../assets/banner.png'
import mobileBanner from '../../assets/banner-mobile.png'

const BANNERS = {
  small: mobileBanner,
  medium: desktopBanner,
  large: desktopBanner,
}

function HeroBanner({ onRequestNewProposal }) {
  const { account } = useWallet()

  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const banner = BANNERS[layoutName]

  return (
    <div
      css={`
        flex-basis: 25%;
        height: fit-content;
        margin-left: ${3 * GU}px;

        top: ${3 * GU}px;
        position: sticky;
      `}
    >
      <div
        css={`
          background: url(${banner}) no-repeat;

          height: 520px;
          width: 327px;
          padding: ${8 * GU}px;
          text-align: center;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')};
            margin-bottom: ${3 * GU}px;
          `}
        >
          {account
            ? `The community wants to hear from you!`
            : `Connect your account to create a proposal`}
        </h2>
        {account && (
          <Button
            mode="strong"
            onClick={onRequestNewProposal}
            label="Create proposal"
            icon={<IconPlus />}
            display={compactMode ? 'icon' : 'label'}
          />
        )}
      </div>
    </div>
  )
}

export default HeroBanner
