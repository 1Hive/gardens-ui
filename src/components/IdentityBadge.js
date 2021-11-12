import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { IdentityBadge as Badge, GU, RADIUS } from '@1hive/1hive-ui'

import { getNetwork } from '@/networks'
import { getProfileForAccount } from '@lib/profile'

const addressCache = new Map()

const IdentityBadge = React.memo(function IdentityBadge({
  entity,
  iconSize = '24',
  ...props
}) {
  const [profile, setProfile] = useState(null)
  const history = useHistory()

  const { explorer, type } = getNetwork()

  const handleViewProfile = useCallback(() => {
    history.push(`/profile?account=${entity}`)
  }, [entity, history])

  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      if (addressCache.get(entity)) {
        setProfile(addressCache.get(entity))
        return
      }
      const profile = await getProfileForAccount(entity)
      if (profile && !cancelled) {
        setProfile(profile)
        addressCache.set(entity, profile)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [entity])

  const badgeProps = {
    label: profile?.name,
    entity,
    explorerProvider: explorer,
    networkType: type,
    popoverAction: { label: 'View profile', onClick: handleViewProfile },
  }

  if (profile?.image) {
    badgeProps.icon = (
      <img
        src={profile.image}
        height={iconSize}
        width={iconSize}
        alt=""
        css={`
          border-radius: ${RADIUS}px;
          display: block;
          object-fit: cover;
          margin-right: ${0.5 * GU}px;
        `}
      />
    )
  }

  return <Badge {...badgeProps} {...props} />
})

export default IdentityBadge
