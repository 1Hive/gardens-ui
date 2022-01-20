import React, { useCallback, useMemo } from 'react'
import { getProviderFromUseWalletId } from 'use-wallet'
import {
  ButtonBase,
  GU,
  Link,
  RADIUS,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import { getConnectors } from '@/ethereum-providers/connectors'

type OnActivateType = (providerId: string) => Promise<void>

type ScreenProviderType = {
  onActivate: OnActivateType
}

function ScreenProviders({ onActivate }: ScreenProviderType) {
  const theme = useTheme()
  const { below } = useViewport()

  const providersInfo = useMemo(() => {
    const isMobileView = below('medium')
    const connectors = getConnectors(isMobileView)
    return connectors.map(
      (provider) =>
        [provider.id, getProviderFromUseWalletId(provider.id)] as const
    )
  }, [below])

  return (
    <div>
      <h4
        css={`
          padding-top: ${2 * GU}px;
          padding-left: ${2 * GU}px;
          ${textStyle('label2')};
          color: ${theme.contentSecondary};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Ethereum providers
      </h4>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          padding: ${2 * GU}px ${2 * GU}px 0;
        `}
      >
        <div
          css={`
            display: grid;
            grid-gap: ${1.5 * GU}px;
            grid-auto-flow: row;
            grid-template-columns: repeat(2, 1fr);
          `}
        >
          {providersInfo.map(([id, provider]) => (
            <ProviderButton
              key={id}
              id={id}
              provider={provider}
              onActivate={onActivate}
            />
          ))}
        </div>
        <div
          css={`
            display: flex;
            justify-content: center;
            margin-top: ${2 * GU}px;
          `}
        >
          <Link
            href="https://ethereum.org/wallets/"
            css="text-decoration: none"
          >
            What is an Ethereum provider?
          </Link>
        </div>
      </div>
    </div>
  )
}

type ProviderButtonType = {
  id: string
  provider?: {
    image: string
    name: string
  }
  onActivate: OnActivateType
}

function ProviderButton({
  id,
  provider,
  onActivate,
}: ProviderButtonType): JSX.Element {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    onActivate(id)
  }, [onActivate, id])

  return (
    <ButtonBase
      key={id}
      onClick={handleClick}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: ${12 * GU}px;
        background: ${theme.surface};
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: ${RADIUS}px;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      {provider && (
        <>
          <img src={provider.image} alt="" height={5.25 * GU} />
          <div
            css={`
              margin-top: ${1 * GU}px;
              ${textStyle('body1')};
            `}
          >
            {provider.name}
          </div>
        </>
      )}
    </ButtonBase>
  )
}

export default ScreenProviders
