import React from 'react'
import { useRouter } from 'next/router'

import { useAppTheme } from '@/providers/AppTheme'
import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'

import { buildGardenPath } from '@utils/routing-utils'
import covenantIcon from '@images/icons/base/covenantIcon.svg'
import createProposalIcon from '@images/icons/base/createProposal.svg'
import feedIcon from '@images/icons/base/feedIcon.svg'
import covenantIconDark from '@images/icons/dark-mode/covenantIcon.svg'
import createProposalIconDark from '@images/icons/dark-mode/createProposal.svg'
import feedIconDark from '@images/icons/dark-mode/feedIcon.svg'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const router = useRouter()
  // const history = useHistory()
  const { appearance } = useAppTheme()

  const gardenNavigationItems = [
    {
      icon: appearance === 'light' ? feedIcon : feedIconDark,
      label: 'Feed',
      path: buildGardenPath(router, ''),
      onClick: onToggle,
    },
    {
      icon: appearance === 'light' ? covenantIcon : covenantIconDark,
      label: 'Covenant',
      path: buildGardenPath(router, 'covenant'),
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
            active={router.pathname === path}
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
