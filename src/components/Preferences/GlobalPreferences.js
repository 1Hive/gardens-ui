import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Tabs,
  springs,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import { Transition, animated } from 'react-spring/renderprops'
import { useEsc } from '../../hooks/useKeyboardArrows'

const SECTIONS = new Map([['generalInfo', 'General Info']])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())

const NETWORK_INDEX = 0

const AnimatedDiv = animated.div

function GlobalPreferences({ compact, onClose, onNavigation, sectionIndex }) {
  useEsc(onClose)

  const container = useRef()
  useEffect(() => {
    if (container.current) {
      container.current.focus()
    }
  }, [])

  return (
    <div ref={container} tabIndex="0" css="outline: 0">
      <Layout css="z-index: 2">
        <Close compact={compact} onClick={onClose} />
        <Header
          primary="Global preferences"
          css={`
            padding-top: ${!compact ? 10 * GU : 0}px;
          `}
        />
        <React.Fragment>
          <Tabs
            items={VALUES}
            onChange={onNavigation}
            selected={sectionIndex}
          />

          {sectionIndex === NETWORK_INDEX && <div>HELLOOOOOOOOO </div>}
        </React.Fragment>
      </Layout>
    </div>
  )
}

function useGlobalPreferences({ path = '', onScreenChange }) {
  const [sectionIndex, setSectionIndex] = useState(null)
  const handleNavigation = useCallback(
    index => {
      onScreenChange(PATHS[index])
    },
    [onScreenChange]
  )

  useEffect(() => {
    if (!path) {
      setSectionIndex(null)
      return
    }
    const index = PATHS.findIndex(item => path.startsWith(item))

    setSectionIndex(index === -1 ? null : index)
  }, [path, sectionIndex])

  return { sectionIndex, handleNavigation }
}

function Close({ compact, onClick }) {
  const theme = useTheme()
  return (
    <div
      css={`
        position: absolute;
        right: 0;
        padding-top: ${2.5 * GU}px;
        padding-right: ${3 * GU}px;

        ${compact &&
          `
            padding-top: ${2 * GU}px;
            padding-right: ${1.5 * GU}px;
          `}
      `}
    >
      <ButtonIcon onClick={onClick} label="Close">
        <IconClose
          css={`
            color: ${theme.surfaceIcon};
          `}
        />
      </ButtonIcon>
    </div>
  )
}

function AnimatedGlobalPreferences({ path, onScreenChange, onClose }) {
  const { sectionIndex, handleNavigation } = useGlobalPreferences({
    path,
    onScreenChange,
  })

  const { below } = useViewport()
  const compact = below('medium')
  const theme = useTheme()

  return (
    <Transition
      native
      items={sectionIndex !== null}
      from={{ opacity: 0, enterProgress: 0, blocking: false }}
      enter={{ opacity: 1, enterProgress: 1, blocking: true }}
      leave={{ opacity: 0, enterProgress: 1, blocking: false }}
      config={springs.smooth}
    >
      {show =>
        show &&
        /* eslint-disable react/prop-types */
        // z-index 1 on mobile keeps the menu above this preferences modal
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedDiv
            style={{
              zIndex: 1,
              pointerEvents: blocking ? 'auto' : 'none',
              opacity,
              transform: enterProgress.interpolate(
                v => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
              ),
            }}
            css={`
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              overflow: auto;
              min-width: ${45 * GU}px;
              padding-bottom: ${compact ? 2 : 0 * GU}px;
              border-top: 2px solid ${theme.accent};
              background: ${theme.surface};
            `}
          >
            <GlobalPreferences
              onClose={onClose}
              compact={compact}
              sectionIndex={sectionIndex}
              onNavigation={handleNavigation}
            />
          </AnimatedDiv>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

export default React.memo(AnimatedGlobalPreferences)
