// @ts-nocheck

import React, { useCallback, useMemo } from "react";
import { getProviderFromUseWalletId } from "use-wallet";
import {
  ButtonBase,
  GU,
  Link,
  RADIUS,
  textStyle,
  useTheme,
} from "@1hive/1hive-ui";
import { CONNECTORS } from "@/ethereum-providers/connectors";
import { css, jsx } from "@emotion/react";
import { Provider } from "use-wallet/dist/cjs/types";

function ScreenProviders({ onActivate }: { onActivate: (x) => void }) {
  const theme = useTheme();

  const providersInfo = useMemo(() => {
    return CONNECTORS.map((provider) => [
      provider.id,
      getProviderFromUseWalletId(provider.id),
    ]);
  }, []);

  return (
    <div>
      <h4
        css={css`
          padding-top: ${2 * GU}px;
          padding-left: ${2 * GU}px;
          ${textStyle("label2")};
          color: ${theme.contentSecondary.toString()};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Ethereum providers
      </h4>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          padding: ${2 * GU}px ${2 * GU}px 0;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-gap: ${1.5 * GU}px;
            grid-auto-flow: row;
            grid-template-columns: repeat(2, 1fr);
          `}
        >
          {providersInfo.map(([id, provider]) => (
            <React.Fragment key={id}>
              <ProviderButton
                id={id}
                provider={provider}
                onActivate={onActivate}
              />
            </React.Fragment>
          ))}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            margin-top: ${2 * GU}px;
          `}
        >
          <Link
            href="https://ethereum.org/wallets/"
            style={{
              textDecoration: "none",
            }}
          >
            What is an Ethereum provider?
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProviderButton({
  id,
  provider,
  onActivate,
}: {
  id: string;
  provider: Provider;
  onActivate: (id) => void;
}) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    onActivate(id);
  }, [onActivate, id]);

  return (
    <ButtonBase
      key={id}
      onClick={handleClick}
      css={css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: ${12 * GU}px;
        background: ${theme.surface.toString()};
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: ${RADIUS}px;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={provider.image} alt="" height={5.25 * GU} />
      <div
        css={css`
          margin-top: ${1 * GU}px;
          ${textStyle("body1")};
        `}
      >
        {provider.name}
      </div>
    </ButtonBase>
  );
}

export default ScreenProviders;
