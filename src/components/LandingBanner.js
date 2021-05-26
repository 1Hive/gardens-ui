import React from 'react'
import { Button, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import landingBannerSvg from '@assets/landingBanner.png'

const LandingBanner = React.forwardRef((props, ref) => {
  const theme = useTheme()

  return (
    <div
      ref={ref}
      css={`
        background: url(${landingBannerSvg}) no-repeat;
        background-size: contain;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: 26.5%;
      `}
    >
      <div
        css={`
          position: absolute;
          top: 25%;
          left: 0;
          width: 100%;
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
              width: 33%;
            `}
          >
            <div
              css={`
                margin-bottom: 7%;
              `}
            >
              <h1
                css={`
                  font-size: 52px;
                  font-weight: bold;
                  color: #048333;
                `}
              >
                Find your tribe
              </h1>
              <p
                css={`
                  color: ${theme.contentSecondary};
                  ${textStyle('body1')};
                `}
              >
                Gardens are digital economies that anyone can help shape
              </p>
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <Button
                label="Documentation"
                href="https://wiki.1hive.org/projects/gardens"
                target="_blank"
                wide
                css={`
                  margin-right: ${2 * GU}px;
                `}
              />
              <Button label="Create garden" mode="strong" wide />
              {/* TODO: add link */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default LandingBanner
