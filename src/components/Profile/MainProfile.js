import React from 'react'
import {
  Box,
  EthIdenticon,
  GU,
  Link,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useProfile } from '../../providers/Profile'

const IMAGE_DIMENSION = 20 * GU
const BOX_PADDING = 5 * GU

function MainProfile() {
  const theme = useTheme()
  const {
    account,
    description,
    email,
    image,
    name,
    verifiedAccounts,
    website,
  } = useProfile()

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
          {image ? (
            <img
              src={image}
              width={IMAGE_DIMENSION}
              height={IMAGE_DIMENSION}
              alt=""
              css={`
                border-radius: 50%;
                object-fit: cover;
              `}
            />
          ) : (
            <EthIdenticon address={account} radius={100} scale={7} />
          )}
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
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <div>
              {email && (
                <div
                  css={`
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    ${textStyle('body2')}
                  `}
                >
                  {email}
                </div>
              )}
              {website && (
                <div
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                >
                  {website}
                </div>
              )}
            </div>
            {verifiedAccounts && (
              <div
                css={`
                  display: flex;
                  justify-content: space-evenly;
                `}
              >
                {Object.values(verifiedAccounts).map(
                  (verifiedAccount, index) => {
                    return (
                      <div key={index}>
                        <Link href={verifiedAccount.url}>
                          <img
                            src={verifiedAccount.icon}
                            width="24"
                            height="24"
                            alt=""
                            css="display:block"
                          />
                        </Link>
                      </div>
                    )
                  }
                )}
              </div>
            )}
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
                    margin-top: ${1 * GU}px;
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
