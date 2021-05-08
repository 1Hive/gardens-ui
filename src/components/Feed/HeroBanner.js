import React from 'react'
import {
  BIG_RADIUS,
  Button,
  GU,
  IconPlus,
  textStyle,
  useLayout,
} from '@1hive/1hive-ui'
import { useWallet } from '../../providers/Wallet'

import desktopBanner from '../../assets/banner.png'
import mobileBanner from '../../assets/banner-mobile.png'
import tabletBanner from '../../assets/banner-tablet.png'

const BANNERS = {
  small: { image: mobileBanner, aspectRatio: '54%' },
  medium: { image: tabletBanner, aspectRatio: '36%' },
  large: { image: desktopBanner, aspectRatio: '159%' },
  max: { image: desktopBanner, aspectRatio: '159%' },
}

function HeroBanner({ onRequestNewProposal }) {
  const { account } = useWallet()
  const { layoutName } = useLayout()

  const banner = BANNERS[layoutName]
  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const compactMode = mobileMode || tabletMode

  return (
    <div
      css={`
        height: fit-content;
        ${mobileMode && `margin-top: ${2 * GU}px;`}
      `}
    >
      <div
        css={`
          background: url(${banner.image}) no-repeat;
          background-size: cover;
          ${tabletMode && `min-height: ${27 * GU}px;`}
          padding-top: ${banner.aspectRatio};
          position: relative;
          ${tabletMode && `border-radius: ${BIG_RADIUS}px`};
        `}
      >
        <div
          css={`
            padding: ${8 * GU}px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: ${compactMode ? 'center' : 'flex-start'};
          `}
        >
          <div
            css={`
              text-align: center;
              width: 100%;
            `}
          >
            <h2
              css={`
                ${textStyle(compactMode ? 'title3' : 'title2')};
                margin: 0 auto;
                max-width: 300px;
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
                display="label"
                css={`
                  margin-top: ${3 * GU}px;
                `}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
