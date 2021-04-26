import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, useTheme, useViewport } from '@1hive/1hive-ui'

import flowerError from '../../assets/flowerError.svg'

function GlobalErrorScreen({ children }) {
  return (
    <div
      css={`
        height: 100vh;
        min-width: ${45 * GU}px;
        overflow: auto;
        background-repeat: repeat-x;
        background-size: cover;
        border-top-style: solid;
        border-top-width: 4px;
        border-top-color: #6050b0;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${8 * GU}px;
          min-height: 100%;
        `}
      >
        <Container>
          <img
            src={flowerError}
            alt=""
            width="147"
            height="144"
            css={`
              display: block;
              margin: ${5 * GU}px auto ${1.5 * GU}px;
            `}
          />
          {children}
        </Container>
      </div>
    </div>
  )
}

GlobalErrorScreen.propTypes = {
  children: PropTypes.node,
}

function Container({ children }) {
  const theme = useTheme()
  const { width } = useViewport()
  return width < 60 * GU ? (
    <div
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-width: ${45 * GU}px;
        overflow: auto;
        background: ${theme.surface};
        display: grid;
        align-items: center;
      `}
    >
      <div
        css={`
          padding: ${5 * GU}px ${6 * GU}px ${6 * GU}px;
        `}
      >
        {children}
      </div>
    </div>
  ) : (
    <Card
      css={`
        display: block;
        padding: ${5 * GU}px ${6 * GU}px;
        width: 100%;
        max-width: ${72 * GU}px;
        height: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        cursor: unset;
      `}
    >
      {children}
    </Card>
  )
}

Container.propTypes = {
  children: PropTypes.node,
}

export default GlobalErrorScreen
