import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, IconCalendar, GU, RADIUS, textStyle, useTheme } from '@1hive/1hive-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SINGLE_DATE, INPUT_BORDER } from './consts';

const Labels = forwardRef(function Labels({ enabled, startText, hasSetDates, onClick, ...props }, ref) {
  const theme = useTheme();

  const hasNoStart = startText === SINGLE_DATE;

  return (
    <ButtonBase focusRingRadius={RADIUS} ref={ref} onClick={onClick}>
      <div
        css={css`
          position: relative;
          width: ${27.5 * GU}px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 6px;
          border: ${INPUT_BORDER}px solid ${hasSetDates ? theme.accent.toString() : theme.border.toString()};
          border-radius: ${RADIUS}px;
          background: ${theme.surface.toString()};
          overflow: hidden;
          cursor: pointer;
          &:active {
            border-color: ${theme.controlBorderPressed.toString()};
          }
          &:focus {
            outline: none;
          }
        `}
        {...props}
      >
        <div
          css={css`
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;
          `}
        >
          <div
            css={css`
              color: ${hasNoStart ? theme.hint.toString() : 'inherit'};
              text-align: center;
              ${textStyle(hasNoStart ? 'body2' : 'body3')}
            `}
          >
            {startText}
          </div>
          <div
            css={css`
              color: ${theme.hint.alpha(0.3).toString()};
              font-size: 13px;
            `}
          >
            |
          </div>
        </div>
        <div
          css={css`
            display: flex;
            padding: 0 4px 0 10px;
          `}
        >
          <IconCalendar
            css={css`
              color: ${enabled ? theme.accent.toString() : theme.surfaceIcon.toString()};
            `}
          />
        </div>
      </div>
    </ButtonBase>
  );
});

Labels.propTypes = {
  enabled: PropTypes.bool,
  hasSetDates: PropTypes.bool,
  onClick: PropTypes.func,
  startText: PropTypes.string.isRequired,
};

export default Labels;
