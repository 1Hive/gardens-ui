import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Root,
  Tabs,
  springs,
  useTheme,
  useViewport,
} from "@1hive/1hive-ui";
import { Transition, animated } from "react-spring/renderprops";
import { useEsc } from "../../../hooks/useKeyboardArrows";

import AppsAddresses from "./AppsAddresses";
import EVMExecutor from "./EVMExecutor";

/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

const SECTIONS = new Map([
  ["generalInfo", "General Info"],
  ["evmExecutor", "EVM Executor"],
]);
const PATHS = Array.from(SECTIONS.keys());
const VALUES = Array.from(SECTIONS.values());

const GENERAL_INFO_INDEX = 0;
const EVM_EXECUTOR_INDEX = 1;

const AnimatedDiv = animated.div;

function GlobalPreferences({ compact, onClose, onNavigation, sectionIndex }) {
  useEsc(onClose);

  const container = useRef();
  useEffect(() => {
    if (container.current) {
      container.current.focus();
    }
  }, []);

  return (
    <div
      ref={container}
      tabIndex="0"
      css={css`
        outline: 0;
      `}
    >
      <Layout
        css={css`
          z-index: 2;
        `}
      >
        <Close compact={compact} onClick={onClose} />
        <Header
          primary="Global preferences"
          css={css`
            padding-top: ${!compact ? 10 * GU : 0}px;
          `}
        />
        <Root.Provider>
          <React.Fragment>
            <Tabs
              items={VALUES}
              onChange={onNavigation}
              selected={sectionIndex}
            />

            {sectionIndex === GENERAL_INFO_INDEX && <AppsAddresses />}
            {sectionIndex === EVM_EXECUTOR_INDEX && <EVMExecutor />}
          </React.Fragment>
        </Root.Provider>
      </Layout>
    </div>
  );
}

function useGlobalPreferences({ path = "", onScreenChange }) {
  const [sectionIndex, setSectionIndex] = useState(null);
  const handleNavigation = useCallback(
    (index) => {
      onScreenChange(PATHS[index]);
    },
    [onScreenChange]
  );

  useEffect(() => {
    if (!path) {
      setSectionIndex(null);
      return;
    }
    const index = PATHS.findIndex((item) => path.startsWith(item));

    setSectionIndex(index === -1 ? null : index);
  }, [path, sectionIndex]);

  return { sectionIndex, handleNavigation };
}

function Close({ compact, onClick }) {
  const theme = useTheme();
  return (
    <div
      css={css`
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
          css={css`
            color: ${theme.surfaceIcon.toString()};
          `}
        />
      </ButtonIcon>
    </div>
  );
}

function AnimatedGlobalPreferences({ path, onScreenChange, onClose }) {
  const { sectionIndex, handleNavigation } = useGlobalPreferences({
    path,
    onScreenChange,
  });

  const { below } = useViewport();
  const compact = below("medium");
  const theme = useTheme();

  return (
    <Transition
      native
      items={sectionIndex !== null}
      from={{ opacity: 0, enterProgress: 0, blocking: false }}
      enter={{ opacity: 1, enterProgress: 1, blocking: true }}
      leave={{ opacity: 0, enterProgress: 1, blocking: false }}
      config={springs.smooth}
    >
      {(show) =>
        show &&
        /* eslint-disable react/prop-types */
        // z-index 1 on mobile keeps the menu above this preferences modal
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedDiv
            style={{
              zIndex: 1,
              pointerEvents: blocking ? "auto" : "none",
              opacity,
              transform: enterProgress.interpolate(
                (v) => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
              ),
            }}
            css={css`
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              overflow: auto;
              min-width: ${45 * GU}px;
              padding-bottom: ${compact ? 2 : 0 * GU}px;
              border-top: 2px solid ${theme.accent.toString()};
              background: ${theme.surface.toString()};
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
  );
}

export default React.memo(AnimatedGlobalPreferences);
