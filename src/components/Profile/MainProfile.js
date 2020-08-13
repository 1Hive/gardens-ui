import React from 'react'
import { Box, GU, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui'
import { useProfile } from '../../providers/Profile'

const IMAGE_DIMENSION = 20 * GU
const BOX_PADDING = 5 * GU

function MainProfile() {
  const theme = useTheme()
  const { account, description, image, name } = useProfile()

  return (
    <Box padding={BOX_PADDING}>
      <div
        css={`
          position: relative;
          text-align: center;
        `}
      >
        <div
          css={`
            position: absolute;
            top: -${IMAGE_DIMENSION / 2 + BOX_PADDING}px;
            width: 100%;
          `}
        >
          <img
            src={image}
            width={IMAGE_DIMENSION}
            height={IMAGE_DIMENSION}
            alt=""
            css={`
              border-radius: 50%;
            `}
          />
        </div>
        <div
          css={`
            padding-top: ${IMAGE_DIMENSION / 2}px;
          `}
        >
          <div>
            <div
              css={`
                ${textStyle('title3')}
              `}
            >
              {name}
            </div>
            <div
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              {shortenAddress(account)}
            </div>
          </div>
          {description && (
            <>
              <div
                css={`
                  height: 1px;
                  border-top: 1px solid ${theme.border};
                  margin: ${3 * GU}px 0;
                `}
              />
              <div
                css={`
                  text-align: left;
                `}
              >
                <h4
                  css={`
                    ${textStyle('body1')};
                  `}
                >
                  About me
                </h4>
                <p
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                >
                  {description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  )
}

export default MainProfile
