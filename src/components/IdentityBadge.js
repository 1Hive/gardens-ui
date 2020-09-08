import React, { useEffect, useState } from 'react'
import { IdentityBadge as Badge } from '@1hive/1hive-ui'

import { getNetworkType } from '../lib/web3-utils'
import { getProfileForAccount } from '../lib/profile'

const addressCache = new Map()

function IdentityBadge({ entity, useBox, ...props }) {
  const [profileName, setProfileName] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      if (addressCache.get(entity)) {
        setProfileName(addressCache.get(entity))
        return
      }

      const profile = await getProfileForAccount(entity)
      if (!cancelled) {
        setProfileName(profile.name)
        addressCache.set(entity, profile.name)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [entity])

  return (
    <Badge
      customLabel={profileName}
      entity={entity}
      networkType={getNetworkType()}
      {...props}
    />
  )
}

export default IdentityBadge
