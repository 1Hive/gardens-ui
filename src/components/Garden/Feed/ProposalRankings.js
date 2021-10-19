import React, { useCallback } from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import { useAppTheme } from '@providers/AppTheme'

import iconTopSvg from '@assets/rankings/ranking-top.svg'
import iconTopSelectedSvg from '@assets/rankings/ranking-top-selected.svg'
import iconNewSvg from '@assets/rankings/ranking-new.svg'
import iconNewSelectedSvg from '@assets/rankings/ranking-new-selected.svg'

import iconTopSvgDarkMode from '@assets/dark-mode/rankings/ranking-top.svg'
import iconTopSelectedSvgDarkMode from '@assets/dark-mode/rankings/ranking-top-selected.svg'
import iconNewSvgDarkMode from '@assets/dark-mode/rankings/ranking-new.svg'
import iconNewSelectedSvgDarkMode from '@assets/dark-mode/rankings/ranking-new-selected.svg'

const iconsMapping = {
  top: {
    icon: iconTopSvg,
    iconSelected: iconTopSelectedSvg,
    label: 'Most supported',
  },
  new: {
    icon: iconNewSvg,
    iconSelected: iconNewSelectedSvg,
    label: 'Newest',
  },
}

const iconsMappingDarkMode = {
  top: {
    icon: iconTopSvgDarkMode,
    iconSelected: iconTopSelectedSvgDarkMode,
  },
  new: {
    icon: iconNewSvgDarkMode,
    iconSelected: iconNewSelectedSvgDarkMode,
  },
}

function getRankingIcon(key, selected, mappingType) {
  return mappingType[key][selected ? 'iconSelected' : 'icon']
}

function getRankingLabel(key) {
  return iconsMapping[key].label
}

function ProposalRankings({ items, onChange, selected }) {
  const appearance = useAppTheme()
  const mappingType =
    appearance.appearance === 'light' ? iconsMapping : iconsMappingDarkMode

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        position: relative;
        z-index: 3;
      `}
    >
      {items.map((item, index) => (
        <Item
          key={index}
          icon={getRankingIcon(item, selected === index, mappingType)}
          index={index}
          label={getRankingLabel(item)}
          onSelect={onChange}
          selected={selected === index}
        />
      ))}
    </div>
  )
}

function Item({ icon, index, label, onSelect, selected }) {
  const theme = useTheme()

  const handleOnClick = useCallback(() => {
    onSelect(index)
  }, [index, onSelect])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        color: ${theme.accentContent};
        margin-right: ${1 * GU}px;
        border-radius: ${2 * GU}px;
        padding: ${0.5 * GU}px ${0.75 * GU}px;
        background: linear-gradient(
          268deg,
          ${theme.accentEnd},
          ${theme.accentStart}
        );

        ${!selected &&
          `
          background: ${theme.surface};
          color: ${theme.contentSecondary};
          cursor: pointer;
          border: 1px solid ${theme.border};
          &:hover {
            background: linear-gradient(268.53deg, rgba(170, 245, 212, 0.2) 0%, rgba(124, 224, 214, 0.2) 100%);
          }
        `}
      `}
      onClick={handleOnClick}
    >
      <img src={icon} height="22" width="22" alt="" />
      <div
        css={`
          ${textStyle('label1')};
          margin-left: ${0.75 * GU}px;
        `}
      >
        {label}
      </div>
    </div>
  )
}

export default ProposalRankings
