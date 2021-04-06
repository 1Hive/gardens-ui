import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Spring, Transition, animated } from 'react-spring/renderprops'
import {
  ButtonIcon,
  GU,
  IconCross,
  Modal,
  RADIUS,
  Root,
  textStyle,
  useLayout,
  useTheme,
  Viewport,
} from '@1hive/1hive-ui'
import { MultiModalProvider, useMultiModal } from './MultiModalProvider'
import { springs } from '../../style/springs'
import { useDisableAnimation } from '../../hooks/useDisableAnimation'
import { useInside } from 'use-inside'

import headerBackground from '../../assets/modal-background.svg'

const DEFAULT_MODAL_WIDTH = 80 * GU
const AnimatedDiv = animated.div

function MultiModalScreens({ screens }) {
  const [, { onClose, handleOnClosed, visible }] = useInside('MultiModal')

  return (
    <MultiModalProvider screens={screens} onClose={onClose}>
      <MultiModalFrame visible={visible} onClosed={handleOnClosed} />
    </MultiModalProvider>
  )
}

MultiModalScreens.propTypes = {
  screens: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node,
      disableClose: PropTypes.bool,
      graphicHeader: PropTypes.bool,
      title: PropTypes.string,
      width: PropTypes.number,
    })
  ).isRequired,
}

/* eslint-disable react/prop-types */
function MultiModalFrame({ visible, onClosed }) {
  const theme = useTheme()
  const { currentScreen, close } = useMultiModal()

  const {
    disableClose,
    width: currentScreenWidth,
    graphicHeader,
  } = currentScreen

  const modalWidth = currentScreenWidth || DEFAULT_MODAL_WIDTH

  const handleModalClose = useCallback(() => {
    if (!disableClose) {
      close()
    }
  }, [disableClose, close])

  return (
    <Viewport>
      {({ width }) => {
        // Apply a small gutter when matching the viewport width
        const viewportWidth = width - 4 * GU

        return (
          <Spring
            config={springs.tight}
            to={{ width: Math.min(viewportWidth, modalWidth) }}
          >
            {({ width }) => {
              return (
                <Modal
                  padding={0}
                  width={width}
                  onClose={handleModalClose}
                  onClosed={onClosed}
                  visible={visible}
                  closeButton={false}
                  css={`
                    z-index: 2;

                    /* TODO: Add radius option to Modal in @aragon/ui */
                    & > div > div > div {
                      border-radius: ${2 * RADIUS}px !important;
                    }
                  `}
                >
                  <div
                    css={`
                      position: relative;
                    `}
                  >
                    {!disableClose && (
                      <ButtonIcon
                        label=""
                        css={`
                          position: absolute;
                          top: ${2.5 * GU}px;
                          right: ${2.5 * GU}px;
                          z-index: 2;
                        `}
                        onClick={handleModalClose}
                      >
                        <IconCross
                          css={`
                            color: ${graphicHeader
                              ? theme.overlay
                              : theme.surfaceContentSecondary};
                          `}
                        />
                      </ButtonIcon>
                    )}

                    <MultiModalContent viewportWidth={viewportWidth} />
                  </div>
                </Modal>
              )
            }}
          </Spring>
        )
      }}
    </Viewport>
  )
}

// We memoize this compontent to avoid excessive re-renders when animating
const MultiModalContent = React.memo(function ModalContent({ viewportWidth }) {
  const theme = useTheme()
  const { step, direction, getScreen } = useMultiModal()
  const [applyStaticHeight, setApplyStaticHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [animationDisabled, enableAnimation] = useDisableAnimation()
  const { layoutName } = useLayout()

  const smallMode = layoutName === 'small'

  const onStart = useCallback(() => {
    enableAnimation()

    if (!animationDisabled) {
      setApplyStaticHeight(true)
    }
  }, [animationDisabled, enableAnimation])

  const renderScreen = useCallback(
    screen => {
      const { title, content, graphicHeader, width } = screen
      const standardPadding = smallMode ? 3 * GU : 5 * GU

      return (
        <>
          {graphicHeader ? (
            <div
              css={`
                position: relative;
                overflow: hidden;
                padding: ${1.5 * GU}px ${standardPadding}px
                  ${1.5 * GU}px ${standardPadding}px;
                background-image: url("${headerBackground}");
                margin-bottom: ${smallMode ? 3 * GU : 5 * GU}px;
              `}
            >
              <h1
                css={`
                  position: relative;
                  z-index: 1;

                  ${smallMode ? textStyle('title3') : textStyle('title2')};
                  font-weight: 600;
                  color: ${theme.overlay};
                `}
              >
                {title}
              </h1>
            </div>
          ) : (
            title && (
              <div
                css={`
                  padding: ${smallMode ? 3 * GU : 5 * GU}px ${standardPadding}px
                    ${smallMode ? 1.5 * GU : 2.5 * GU}px ${standardPadding}px;
                `}
              >
                <h1
                  css={`
                    ${smallMode ? textStyle('title3') : textStyle('title2')};

                    margin-top: -${0.5 * GU}px;
                  `}
                >
                  {title}
                </h1>
              </div>
            )
          )}

          <Root.Provider>
            <div
              css={`
                /* For better performance we avoid reflowing long text between screen changes by matching the screen width with the modal width */
                width: ${Math.min(
                  viewportWidth,
                  width || DEFAULT_MODAL_WIDTH
                )}px;
                padding: ${title ? 0 : standardPadding}px ${standardPadding}px
                  ${standardPadding}px ${standardPadding}px;
              `}
            >
              {content}
            </div>
          </Root.Provider>
        </>
      )
    },
    [smallMode, theme, viewportWidth]
  )

  return (
    <Spring
      config={springs.tight}
      to={{ height }}
      immediate={animationDisabled}
      native
    >
      {({ height }) => (
        <AnimatedDiv
          style={{
            position: 'relative',
            height: applyStaticHeight ? height : 'auto',
          }}
        >
          <Transition
            config={(_, state) =>
              state === 'leave' ? springs.instant : springs.tight
            }
            items={step}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${5 * GU * direction}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              transform: `translate3d(0, ${5 * GU * -direction}px, 0)`,
            }}
            onRest={(_, status) => {
              if (status === 'update') {
                setApplyStaticHeight(false)
              }
            }}
            onStart={onStart}
            native
          >
            {step => animProps => {
              const stepScreen = getScreen(step)

              return (
                <>
                  {stepScreen && (
                    <AnimatedDiv
                      ref={elt => {
                        if (elt) {
                          setHeight(elt.clientHeight)
                        }
                      }}
                      style={{
                        width: '100%',
                        ...animProps,
                      }}
                    >
                      {renderScreen(stepScreen)}
                    </AnimatedDiv>
                  )}
                </>
              )
            }}
          </Transition>
        </AnimatedDiv>
      )}
    </Spring>
  )
})
/* eslint-enable react/prop-types */

export default MultiModalScreens
