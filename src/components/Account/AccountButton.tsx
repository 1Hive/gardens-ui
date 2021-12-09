import React from "react";
import {
  EthIdenticon,
  GU,
  RADIUS,
  shortenAddress,
  textStyle,
  useTheme,
} from "@1hive/1hive-ui";
import { useProfile } from "@providers/Profile";
import HeaderModule from "../Header/HeaderModule";
import { getNetworkName } from "@utils/web3-utils";
import { useWallet } from "@providers/Wallet";
import { css, jsx } from "@emotion/react";

function AccountButton({ onClick }: { onClick?: () => void }) {
  const theme = useTheme();
  const { account, image, name } = useProfile();
  const { chainId } = useWallet();

  return (
    <HeaderModule
      icon={
        <div
          css={css`
            position: relative;
          `}
        >
          {image ? (
            <img
              src={image}
              height="28"
              width="28"
              alt=""
              css={css`
                border-radius: 4px;
                display: block;
                object-fit: cover;
              `}
            />
          ) : (
            <EthIdenticon address={account} radius={RADIUS} />
          )}
          <div
            css={css`
              position: absolute;
              bottom: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background: ${theme.positive.toString()};
              border: 2px solid ${theme.surface.toString()};
              border-radius: 50%;
            `}
          />
        </div>
      }
      content={
        <React.Fragment>
          <div
            css={css`
              margin-bottom: -5px;
              ${textStyle("body2")}
            `}
          >
            <div
              css={css`
                overflow: hidden;
                max-width: ${16 * GU}px;
                text-overflow: ellipsis;
                white-space: nowrap;
              `}
            >
              {name || shortenAddress(account)}
            </div>
          </div>
          <div
            css={css`
              font-size: 11px; /* doesn’t exist in aragonUI */
              color: ${theme.positive.toString()};
            `}
          >
            Connected to {getNetworkName(chainId)}
          </div>
        </React.Fragment>
      }
      onClick={onClick}
    />
  );
}
export default AccountButton;
