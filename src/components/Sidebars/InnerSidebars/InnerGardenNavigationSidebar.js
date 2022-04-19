import React from 'react'
import { useRouter } from 'next/router'

import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'

import { buildGardenPath } from '@utils/routing-utils'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const router = useRouter()
  const query = router.query

  const gardenNavigationItems = [
    {
      icon: '/icons/base/feedIcon.svg',
      label: 'Feed',
      path: buildGardenPath(router, ''),
      onClick: onToggle,
    },
    {
      icon: '/icons/base/covenantIcon.svg',
      label: 'Covenant',
      path: `/${query.networkType}/garden/${query.gardenAddress}/covenant`,
      onClick: onToggle,
    },
    {
      icon: '/icons/base/createProposal.svg',
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
