import React from 'react'
import PropTypes from 'prop-types'
import { keyframes } from 'styled-components'
import { GU, useTheme, textStyle, Link } from '@1hive/1hive-ui'

import { getNetwork } from '@/networks'
import loadingRing from './assets/loading-ring.svg'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const AccountModuleActionScreen = React.memo(function({ onCancel }) {
  const theme = useTheme()
  const { image, name } = getNetwork()

  return (
    <section
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
            width: ${10.5 * GU}px;
            height: ${10.5 * GU}px;
          `}
        >
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url(${loadingRing}) no-repeat 0 0;
              animation-duration: 1s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              animation-name: ${spin};
              // prevents flickering on Firefox
              backface-visibility: hidden;
            `}
          />
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 50% 50% / auto ${5 * GU}px no-repeat url(${image});
            `}
          />
        </div>
        <h1
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          {`Connecting to ${name} network`}
        </h1>
        <p
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {`Create and/or switch to the ${name} network in your provider. You may be temporarily redirected to a new screen.`}
        </p>
      </div>
      <div
        css={`
          flex-grow: 0;
        `}
      >
        {onCancel && <Link onClick={onCancel}>Cancel</Link>}
      </div>
    </section>
  )
})

AccountModuleActionScreen.propTypes = {
  onCancel: PropTypes.func,
}

export default AccountModuleActionScreen
