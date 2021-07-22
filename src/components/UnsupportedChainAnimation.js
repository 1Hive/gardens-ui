import React from 'react'
import { GU, textStyle } from '@1hive/1hive-ui'
import flowerError from '@assets/flowerError.svg'
import { useTransition, animated } from 'react-spring'
import { getSupportedChainsNamesFormatted } from '@/networks'

function UnsupportedChainAnimation() {
  const elements = ['Image', 'Title', 'Subtitle']
  const transitions = useTransition(elements, null, {
    from: { transform: 'translate3d(0,2000px,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0px,0)', opacity: 1, delay: 100000 },
    leave: {},
    trail: 500,
  })

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={`
          margin-top: ${4 * GU}px;
          width: ${40 * GU}px;
        `}
      >
        {transitions.map(({ item, key, props }) =>
          item ? (
            <animated.div
              key={key}
              style={props}
              css={`
                display: flex;
                justify-content: center;
                align-items: center;
                justify-content: center;
                text-align: center;
              `}
            >
              {getComponent(item)}
            </animated.div>
          ) : (
            ''
          )
        )}
      </div>
    </div>
  )
}

function getComponent(type) {
  if (type === 'Image') {
    return <img key={1} src={flowerError} width="130" height="150" />
  }
  if (type === 'Title') {
    return (
      <span
        key={2}
        css={`
          ${textStyle('title1')}
          margin-top: ${2 * GU}px;
        `}
      >
        Wrong Network
      </span>
    )
  }
  if (type === 'Subtitle') {
    return (
      <span
        key={2}
        css={`
          ${textStyle('body1')}
          margin-top: ${2 * GU}px;
        `}
      >
        {`Please select one of these networks in your wallet and try again: ${getSupportedChainsNamesFormatted()}`}
      </span>
    )
  }
}

export default UnsupportedChainAnimation
