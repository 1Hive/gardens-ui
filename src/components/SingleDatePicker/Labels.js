import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  IconCalendar,
  GU,
  RADIUS,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import { SINGLE_DATE, INPUT_BORDER } from './consts'

const Labels = forwardRef(function Labels(
  { enabled, startText, hasSetDates, onClick, ...props },
  ref
) {
  const theme = useTheme()

  const hasNoStart = startText === SINGLE_DATE

  return (
    <ButtonBase focusRingRadius={RADIUS} ref={ref} onClick={onClick}>
      <div
        css={`
          position: relative;
          width: ${27.5 * GU}px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 6px;
          border: ${INPUT_BORDER}px solid
            ${hasSetDates ? theme.accent : theme.border};
          border-radius: ${RADIUS}px;
          background: ${theme.surface};
          overflow: hidden;
          cursor: pointer;
          &:active {
            border-color: ${theme.controlBorderPressed};
          }
          &:focus {
            outline: none;
          }
        `}
        {...props}
      >
        <div
          css={`
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;
          `}
        >
          <div
            css={`
              color: ${hasNoStart ? theme.hint : 'inherit'};
              text-align: center;
              ${textStyle(hasNoStart ? 'body2' : 'body3')}
            `}
          >
            {startText}
          </div>
          <div
            css={`
              color: ${theme.hint.alpha(0.3)};
              font-size: 13px;
            `}
          >
            |
          </div>
        </div>
        <div
          css={`
            display: flex;
            padding: 0 4px 0 10px;
          `}
        >
          <IconCalendar
            css={`
              color: ${enabled ? theme.accent : theme.surfaceIcon};
            `}
          />
        </div>
      </div>
    </ButtonBase>
  )
})

Labels.propTypes = {
  enabled: PropTypes.bool,
  hasSetDates: PropTypes.bool,
  onClick: PropTypes.func,
  startText: PropTypes.string.isRequired,
}

export default Labels
