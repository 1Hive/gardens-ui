import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { IdentityBadge as Badge, GU, RADIUS } from '@1hive/1hive-ui'

import { getNetwork } from '@/networks'
import { getProfileForAccount } from '@lib/profile'

import { css, jsx } from '@emotion/react'

const addressCache = new Map()

function IdentityBadge({
  entity,
  iconSize = '24',
  withProfile = true,
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

    if (!withProfile) {
      return
    }

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
  }, [entity, withProfile])

  const badgeProps = {
    label: profile?.name,
    entity,
    explorerProvider: explorer,
    networkType: type,
    popoverAction: withProfile
      ? { label: 'View profile', onClick: handleViewProfile }
      : null,
    icon: null,
  }

  if (profile?.image) {
    badgeProps.icon = (
      <img
        src={profile.image}
        height={iconSize}
        width={iconSize}
        alt=""
        css={css`
          border-radius: ${RADIUS}px;
          display: block;
          object-fit: cover;
          margin-right: ${0.5 * GU}px;
        `}
      />
    )
  }

  return <Badge {...badgeProps} {...props} />
}

export default React.memo(IdentityBadge)
