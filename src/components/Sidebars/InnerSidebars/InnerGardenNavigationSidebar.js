import React from 'react'
import { useLocation } from 'react-router'

import { useWallet } from '@/providers/Wallet'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { buildGardenPath } from '@/utils/routing-utils'
import { getNetworkType } from '@/utils/web3-utils'

import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'

import covenantIcon from '@assets/covenantIcon.svg'
import createProposalIcon from '@assets/createProposal.svg'
import feedIcon from '@assets/feedIcon.svg'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const location = useLocation()
  const { preferredNetwork } = useWallet()

  const connectedGarden = useConnectedGarden()
  const networkType = getNetworkType(
    connectedGarden?.chainId || preferredNetwork
  )

  const gardenNavigationItems = [
    {
      icon: feedIcon,
      label: 'Feed',
      path: `#/${networkType}/garden/${connectedGarden.address}`,
      onClick: onToggle,
    },
    {
      icon: covenantIcon,
      label: 'Covenant',
      path: `#/${networkType}/garden/${connectedGarden.address}/covenant`,
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
            active={location.pathname === path}
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
