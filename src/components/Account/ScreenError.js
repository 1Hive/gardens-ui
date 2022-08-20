import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, Link, textStyle, useTheme } from '@1hive/1hive-ui'
import { ChainUnsupportedError } from 'use-wallet'
import { SUPPORTED_CHAINS } from '@/networks'
import { getNetworkName } from '@utils/web3-utils'
import { useAppTheme } from '@providers/AppTheme'

import connectionError from '@assets/connection-error.svg'
import connectionErrorDark from '@assets/dark-mode/connection-error-dark.svg'

function AccountModuleErrorScreen({ error, onBack }) {
  const theme = useTheme()
  const elementRef = useRef()
  const { appearance } = useAppTheme()

  let networkNames = ''
  SUPPORTED_CHAINS.forEach((chain, i, array) => {
    networkNames += getNetworkName(chain)
    if (i !== array.length - 1) {
      networkNames += ', '
    }
  })

  const [title, secondary] = useMemo(() => {
    if (error instanceof ChainUnsupportedError) {
      return [
        'Wrong network',
        `Please select one of these networks in your wallet and try again: ${networkNames}`,
      ]
    }
    return [
      'Failed to enable your account',
      'You can try another Ethereum wallet.',
    ]
  }, [error, networkNames])

  return (
    <section
      ref={elementRef}
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        css={`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          css={`
            position: relative;
            width: 281px;
            height: 188px;
            background: 50% 50% / 100% 100% no-repeat
              url(${appearance === 'light'
                ? connectionErrorLight
                : connectionErrorDark});
          `}
        />
        <h1
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          {title}
        </h1>
        <p
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {secondary}
        </p>
      </div>
      <div
        css={`
          flex-grow: 0;
        `}
      >
        <Link onClick={onBack}>OK, try again</Link>
      </div>
    </section>
  )
}

AccountModuleErrorScreen.propTypes = {
  error: PropTypes.object,
  onBack: PropTypes.func.isRequired,
}

export default AccountModuleErrorScreen
