import React from 'react'
import { useHistory } from 'react-router'

import { useAppTheme } from '@/providers/AppTheme'
import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'

import { buildGardenPath } from '@utils/routing-utils'
import covenantIcon from '@assets/covenantIcon.svg'
import createProposalIcon from '@assets/createProposal.svg'
import feedIcon from '@assets/feedIcon.svg'
import covenantIconDark from '@assets/dark-mode/covenantIcon.svg'
import createProposalIconDark from '@assets/dark-mode/createProposal.svg'
import feedIconDark from '@assets/dark-mode/feedIcon.svg'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const history = useHistory()
  const { appearance } = useAppTheme()

  const gardenNavigationItems = [
    {
      icon: appearance === 'light' ? feedIcon : feedIconDark,
      label: 'Feed',
      path: buildGardenPath(history.location, ''),
      onClick: onToggle,
    },
    {
      icon: appearance === 'light' ? covenantIcon : covenantIconDark,
      label: 'Covenant',
      path: buildGardenPath(history.location, 'covenant'),
      onClick: onToggle,
    },
    {
      icon:
        appearance === 'light' ? createProposalIcon : createProposalIconDark,
      label: 'Create Proposal',
      path: '',
      onClick: () => {
        onToggle()
        onOpenCreateProposal()
      },
    },
  ]

  return (
    <BaseInnerSidebar width={width}>
      <ul>
        {gardenNavigationItems.map(({ icon, label, path, onClick }) => (
          <NavigationItem
            key={path}
            active={history.location.pathname === path}
            label={label}
            path={path}
            src={icon}
            onClick={onClick}
          />
        ))}
      </ul>
    </BaseInnerSidebar>
  )
}

export default InnerGardenNavigationSidebar
