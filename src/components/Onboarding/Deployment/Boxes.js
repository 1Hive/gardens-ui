import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  GU,
  ProgressBar,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import { animated } from 'react-spring/renderprops'

import { TransactionStatusType } from '@/prop-types'
import flowerSvg from './assets/flower.svg'
import gardensLogoMark from '@assets/gardensLogoMark.svg'
import linesSvg from './assets/lines.svg'

const AnimDiv = animated.div
const AnimSection = animated.section

function BoxBase({
  children,
  background,
  boxTransform,
  direction = 'column',
  opacity,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const fullWidth = below('large')
  return (
    <AnimDiv
      style={{ opacity }}
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${fullWidth ? 0 : 8 * GU}px;
        background: ${background || theme.background};
      `}
    >
      <AnimSection
        style={{ transform: boxTransform }}
        css={`
          flex-grow: 1;
          display: ${direction === 'column' ? 'grid' : 'flex'};
          flex-direction: ${direction};
          align-items: center;
          justify-content: center;
          max-width: ${fullWidth ? 'none' : `${128 * GU}px`};
          height: ${fullWidth ? 'auto' : `${80 * GU}px`};
          background: ${theme.surface};
          border-radius: ${fullWidth ? 0 : 12}px;
          box-shadow: ${fullWidth
            ? 'none'
            : '0px 10px 28px rgba(0, 0, 0, 0.15)'};
          position: ${fullWidth ? 'absolute' : 'static'};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: ${fullWidth ? 'auto' : 'visible'};
        `}
      >
        {children}
      </AnimSection>
    </AnimDiv>
  )
}

BoxBase.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
  boxTransform: PropTypes.object.isRequired,
  direction: PropTypes.oneOf([
    'column',
    'column-reverse',
    'row',
    'row-reverse',
  ]),
  opacity: PropTypes.object.isRequired,
}

export function BoxProgress({
  allSuccess,
  boxTransform,
  opacity,
  pending,
  transactionsStatus,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const fullWidth = below('large')

  const progress = Math.max(
    0,
    Math.min(1, allSuccess ? 1 : pending / transactionsStatus.length)
  )

  return (
    <>
      <img
        src={flowerSvg}
        height="44"
        alt=""
        css={`
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 2;
        `}
      />
      <BoxBase
        background="#8DE995"
        boxTransform={boxTransform}
        direction={fullWidth ? 'column' : 'row-reverse'}
        opacity={opacity}
      >
        <div
          css={`
            width: ${fullWidth ? 100 : 50}%;
            height: ${fullWidth ? '430px' : '100%'};
            background: linear-gradient(300deg, #3dcb60 -17%, #8de995 280%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            position: relative;
          `}
        >
          <img src={gardensLogoMark} height="272" alt="" />
          <div
            css={`
              background: url(${linesSvg});
              background-repeat: no-repeat;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            `}
          />
        </div>
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: ${fullWidth ? 100 : 50}%;
            height: ${fullWidth ? 'auto' : '100%'};
            padding: ${6 * GU}px;
          `}
        >
          <h1
            css={`
              margin-bottom: ${2 * GU}px;
              ${textStyle('title1')};
              width: 320px;
            `}
          >
            Gardens are digital economies
          </h1>
          <p
            css={`
              ${textStyle('body1')}
              line-height: 2;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Providing a beautiful foundation for public communities to
            coordinate around shared resources in a bottom-up fashion.
          </p>

          {fullWidth && (
            <div
              css={`
                padding-top: ${2 * GU}px;
              `}
            >
              <div
                css={`
                  font-size: 13px;
                  font-weight: 800;
                  text-align: center;
                  padding-bottom: ${1 * GU}px;
                `}
              >
                {Math.round(progress * 100)}%
              </div>
              <ProgressBar value={progress} />
              <div
                css={`
                  padding: ${3 * GU}px 0 ${3 * GU}px;
                  ${textStyle('body1')};
                  text-align: center;
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                Launching your Garden
              </div>
            </div>
          )}
        </div>
      </BoxBase>
    </>
  )
}

BoxProgress.propTypes = {
  allSuccess: PropTypes.bool.isRequired,
  boxTransform: PropTypes.object.isRequired,
  opacity: PropTypes.object.isRequired,
  pending: PropTypes.number.isRequired,
  transactionsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: TransactionStatusType.isRequired,
    })
  ).isRequired,
}

export function BoxReady({ onOpenGarden, opacity, boxTransform }) {
  const { below } = useViewport()
  const fullWidth = below('large')
  const small = below('medium')

  return (
    <BoxBase background="#8DE995" opacity={opacity} boxTransform={boxTransform}>
      <div
        css={`
          ${textStyle('title1')};
          text-align: center;
          padding: ${6 * GU}px ${small ? 6 * GU : 10 * GU}px;
        `}
      >
        <img
          src={gardensLogoMark}
          alt=""
          width="250"
          height="250"
          css={`
            width: ${fullWidth ? 230 : 253}px;
            height: auto;
          `}
        />
        <div
          css={`
            margin: ${6 * GU}px 0;
          `}
        >
          <p>
            <strong>All done!</strong>
          </p>
          <p css="font-weight: 400">Your garden is ready</p>
          <Button
            label="Get started"
            mode="strong"
            onClick={onOpenGarden}
            css={`
              margin-top: ${2 * GU}px;
            `}
          />
        </div>
      </div>
    </BoxBase>
  )
}

BoxReady.propTypes = {
  onOpenGarden: PropTypes.func.isRequired,
  opacity: PropTypes.object.isRequired,
  boxTransform: PropTypes.object.isRequired,
}
