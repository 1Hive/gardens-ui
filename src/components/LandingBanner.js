import React from 'react'
import { Button, GU, useLayout, useTheme, useViewport } from '@1hive/1hive-ui'

import desktopBanner from '@assets/landingBanner.png'
import mobileBanner from '@assets/landingBanner-mobile.png'
import tabletBanner from '@assets/landingBanner-tablet.png'

const BANNERS = {
  small: {
    aspectRatio: '53.5%',
    hFontSize: '32px',
    image: mobileBanner,
    pFontSize: '14px',
  },
  medium: {
    image: tabletBanner,
    aspectRatio: '36.5%',
    hFontSize: '52px',
    pFontSize: '18px',
  },
  large: {
    image: desktopBanner,
    aspectRatio: '26.5%',
    hFontSize: '52px',
    pFontSize: '18px',
  },
  max: {
    image: desktopBanner,
    aspectRatio: '26.5%',
    hFontSize: '64px',
    pFontSize: '20px',
  },
}

const LandingBanner = React.forwardRef(({ onCreateGarden }, ref) => {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { above } = useViewport()

  const { aspectRatio, hFontSize, image, pFontSize } = BANNERS[layoutName]

  return (
    <div
      ref={ref}
      css={`
        background: url(${image}) no-repeat;
        background-size: contain;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: ${aspectRatio};
      `}
    >
      <div
        css={`
          position: absolute;
          top: 40%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            text-align: center;
          `}
        >
          <div
            css={`
              width: min(650px, calc(100% - 150px));
            `}
          >
            <div
              css={`
                margin-bottom: 7%;
              `}
            >
              <h1
                css={`
                  font-size: ${hFontSize};
                  font-weight: bold;
                  color: #048333;
                `}
              >
                Find your tribe
              </h1>
              <p
                css={`
                  font-size: ${pFontSize};
                  color: ${theme.contentSecondary};
                `}
              >
                Gardens are digital economies that anyone can help shape
              </p>
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <Button
                label="Documentation"
                href="https://1hive.gitbook.io/gardens/"
                target="_blank"
                wide
                css={`
                  margin-right: ${2 * GU}px;
                `}
              />
              {above('medium') && (
                <Button
                  label="Create a Garden"
                  mode="strong"
                  onClick={onCreateGarden}
                  wide
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default LandingBanner
