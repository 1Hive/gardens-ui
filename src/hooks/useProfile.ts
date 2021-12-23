import { useEffect, useState } from 'react'

import { isAddress } from '@1hive/1hive-ui'

import { getProfileForAccount } from '@lib/profile'

const CACHE = new Map()

export default function useProfile(account: string) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!account || !isAddress(account)) {
      return
    }

    if (CACHE.get(account)) {
      setProfile(CACHE.get(account))
      return
    }

    let cancelled = false
    async function fetchProfile() {
      const profile = await getProfileForAccount(account)
      if (profile && !cancelled) {
        setProfile(profile)
        CACHE.set(account, profile)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [account])

  return profile
}
