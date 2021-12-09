import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useTheme, textStyle, GU } from "@1hive/1hive-ui";
import { HoverIndicator } from "./components";

import { css, jsx } from "@emotion/react";
function MonthDay({ children, disabled, selected, today, weekDay, ...props }) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      css={css`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${4.5 * GU}px;
        height: ${weekDay ? 3.5 * GU : 4.5 * GU}px;
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
        margin-bottom: 1px;

        ${
          disabled
            ? `
                pointer-events: none;
                opacity: 0;
              `
            : ""
        };

        ${
          selected && !disabled
            ? `
                &&& {
                  background: ${theme.selected.toString()};
                  color: ${theme.positiveContent.toString()};
                }
              `
            : ""
        }

        ${isHovered &&
          css`
            > * {
              z-index: 1;
            }
          `}

        ${today &&
          css`
            color: ${theme.selected.toString()};
            font-weight: 600;
          `}

        ${weekDay &&
          css`
            pointer-events: none;
            color: ${theme.contentSecondary.toString()};
            text-transform: uppercase;
          `}

        &:after {
          display: block;
          content: '';
          margin-top: 100%;
        }
      `}
      {...props}
    >
      {isHovered ? <HoverIndicator theme={theme} selected={selected} /> : null}
      <span
        css={css`
          ${textStyle(weekDay ? "body4" : "body3")};
        `}
      >
        {children}
      </span>
      {today ? (
        <div
          css={css`
            position: absolute;
            bottom: 1px;
            font-size: 9px;
            color: ${selected
              ? theme.surface.toString()
              : theme.selected.toString()};
          `}
        >
          ●
        </div>
      ) : null}
    </div>
  );
}

MonthDay.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  today: PropTypes.bool,
  weekDay: PropTypes.bool,
};

export default MonthDay;
