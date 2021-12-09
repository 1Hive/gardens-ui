import React, { useCallback } from "react";
import { GU, textStyle, useTheme } from "@1hive/1hive-ui";

import iconTopSvg from "@assets/rankings/ranking-top.svg";
import iconTopSelectedSvg from "@assets/rankings/ranking-top-selected.svg";
import iconNewSvg from "@assets/rankings/ranking-new.svg";
import iconNewSelectedSvg from "@assets/rankings/ranking-new-selected.svg";
import { css, jsx } from "@emotion/react";

const iconsMapping = {
  top: {
    icon: iconTopSvg,
    iconSelected: iconTopSelectedSvg,
    label: "Most supported",
  },
  new: {
    icon: iconNewSvg,
    iconSelected: iconNewSelectedSvg,
    label: "Newest",
  },
};

function getRankingIcon(key, selected) {
  return iconsMapping[key][selected ? "iconSelected" : "icon"];
}

function getRankingLabel(key) {
  return iconsMapping[key].label;
}

function ProposalRankings({ items, onChange, selected }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        position: relative;
        z-index: 3;
      `}
    >
      {items.map((item, index) => (
        <Item
          key={index}
          icon={getRankingIcon(item, selected === index)}
          index={index}
          label={getRankingLabel(item)}
          onSelect={onChange}
          selected={selected === index}
        />
      ))}
    </div>
  );
}

function Item({ icon, index, label, onSelect, selected }) {
  const theme = useTheme();

  const handleOnClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        color: ${theme.content.toString()};
        margin-right: ${1 * GU}px;
        border-radius: ${2 * GU}px;
        padding: ${0.5 * GU}px ${1 * GU}px;
        background: linear-gradient(
          268deg,
          ${theme.accentEnd.toString()},
          ${theme.accentStart.toString()}
        );

        ${!selected &&
          `
          background: ${theme.surface.toString()};
          color: ${theme.contentSecondary.toString()};
          cursor: pointer;
          border: 1px solid ${theme.border.toString()};
          &:hover {
            background: linear-gradient(268.53deg, rgba(170, 245, 212, 0.2) 0%, rgba(124, 224, 214, 0.2) 100%);
          }
        `}
      `}
      onClick={handleOnClick}
    >
      <img src={icon} height="22" width="22" alt="" />
      <div
        css={css`
          ${textStyle("label1")};
          margin-left: ${0.75 * GU}px;
        `}
      >
        {label}
      </div>
    </div>
  );
}

export default ProposalRankings;
