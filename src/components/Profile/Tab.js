import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { ButtonBase, GU, textStyle, useTheme } from "@1hive/1hive-ui";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function Tab({ index, item, onChange, selected }) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    onChange(index);
  }, [index, onChange]);

  return (
    <li
      css={css`
        list-style: none;
      `}
    >
      <ButtonBase
        onClick={handleClick}
        css={css`
          ${textStyle("body2")};
          border-radius: 0;
          height: ${5 * GU}px;
          transition: background 50ms ease-in-out;
          &:active {
            background: ${theme.surfacePressed.toString()};
          }
        `}
      >
        <span
          css={css`
            padding: 0 ${3 * GU}px;
            white-space: nowrap;
            color: ${selected
              ? theme.surfaceContent.toString()
              : theme.surfaceContentSecondary.toString()};
          `}
        >
          {item}
        </span>
        <span
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            background: ${theme.selected.toString()};
            width: 2px;
            opacity: ${Number(selected)};
            transition-property: transform, opacity;
            transition-duration: 150ms;
            transition-timing-function: ease-in-out;
            transform: scale3d(1, ${Number(selected)}, 1);
            transform-origin: 0 100%;
          `}
        />
      </ButtonBase>
    </li>
  );
}

Tab.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Tab;
