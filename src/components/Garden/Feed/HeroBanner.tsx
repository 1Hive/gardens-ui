import React from 'react'
import {
  BIG_RADIUS,
  Button,
  GU,
  IconPlus,
  textStyle,
  useLayout,
} from '@1hive/1hive-ui'
import { useWallet } from '@providers/Wallet'

const BANNERS = {
  small: { image: '/icons/base/banner-mobile.png', aspectRatio: '54%' },
  medium: { image: '/icons/base/banner-tablet.png', aspectRatio: '36%' },
  medium_full: {
    image: '/icons/base/banner-tablet-full.png',
    aspectRatio: '36%',
  },
  large: { image: '/icons/base/banner.png', aspectRatio: '159%' },
  max: { image: '/icons/base/banner.png', aspectRatio: '159%' },
}

type HeroBannerProps = {
  onRequestNewProposal: () => void
}

function HeroBanner({ onRequestNewProposal }: HeroBannerProps) {
  const { account } = useWallet()
  const { layoutName } = useLayout()

  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const compactMode = mobileMode || tabletMode
  const banner = tabletMode ? BANNERS.medium_full : BANNERS[layoutName]

  return (
    <div
      css={`
        height: fit-content;
      `}
    >
      <div
        css={`
          background: url(${banner.image}) no-repeat;
          background-size: cover;

          padding-top: ${banner.aspectRatio};
          position: relative;
          ${tabletMode && `min-height: ${28.25 * GU}px;`}
          ${!mobileMode && account && `border-radius: ${BIG_RADIUS}px;`}
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
