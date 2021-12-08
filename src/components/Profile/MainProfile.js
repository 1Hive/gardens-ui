import React from "react";
import {
  Box,
  EthIdenticon,
  GU,
  Link,
  shortenAddress,
  textStyle,
  useTheme,
} from "@1hive/1hive-ui";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

const IMAGE_DIMENSION = 20 * GU;
const BOX_PADDING = 5 * GU;

function MainProfile({ profile }) {
  const theme = useTheme();
  const {
    account,
    description,
    email,
    image,
    name,
    verifiedAccounts,
    website,
  } = profile || {};

  return (
    <Box padding={BOX_PADDING}>
      <div
        css={css`
          position: relative;
          text-align: center;
        `}
      >
        <div
          css={css`
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
              css={css`
                border-radius: 50%;
                object-fit: cover;
              `}
            />
          ) : (
            account && <EthIdenticon address={account} radius={100} scale={7} />
          )}
        </div>
        <div
          css={css`
            padding-top: ${IMAGE_DIMENSION / 2}px;
          `}
        >
          <div>
            <div
              css={css`
                ${textStyle("title3")}
              `}
            >
              {name}
            </div>
            <div
              css={css`
                color: ${theme.contentSecondary.toString()};
              `}
            >
              {shortenAddress(account)}
            </div>
          </div>
          <div
            css={css`
              margin-top: ${2 * GU}px;
            `}
          >
            <div>
              {email && (
                <p
                  css={css`
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  `}
                >
                  {email}
                </p>
              )}
              {website && (
                <p
                  css={css`
                    color: ${theme.contentSecondary.toString()};
                    word-break: break-word;
                  `}
                >
                  {website}
                </p>
              )}
            </div>
            {verifiedAccounts && (
              <div
                css={css`
                  display: flex;
                  justify-content: space-evenly;

                  margin-top: ${2 * GU}px;
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
                            css={css`
                              display: block;
                            `}
                          />
                        </Link>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
          {description && (
            <>
              <div
                css={css`
                  height: 1px;
                  border-top: 1px solid ${theme.border.toString()};
                  margin: ${3 * GU}px 0;
                `}
              />
              <div
                css={css`
                  text-align: left;
                `}
              >
                <h4
                  css={css`
                    ${textStyle("body1")};
                  `}
                >
                  About me
                </h4>
                <p
                  css={css`
                    word-break: break-word;
                    margin-top: ${1 * GU}px;
                    color: ${theme.contentSecondary.toString()};
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
  );
}

export default MainProfile;
