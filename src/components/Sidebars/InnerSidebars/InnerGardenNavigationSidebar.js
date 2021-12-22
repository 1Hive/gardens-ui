import React from 'react'
import { useHistory } from 'react-router'

import { buildGardenPath } from '@utils/routing-utils'

import covenantIcon from '@assets/covenantIcon.svg'
import createProposalIcon from '@assets/createProposal.svg'
import feedIcon from '@assets/feedIcon.svg'

import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const history = useHistory()

  const gardenNavigationItems = [
    {
      icon: feedIcon,
      label: 'Feed',
      path: buildGardenPath(history.location, ''),
      onClick: onToggle,
    },
    {
      icon: covenantIcon,
      label: 'Covenant',
      path: buildGardenPath(history.location, 'covenant'),
      onClick: onToggle,
    },
    {
      icon: createProposalIcon,
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
