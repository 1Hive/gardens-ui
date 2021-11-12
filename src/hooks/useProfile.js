import { useEffect, useState } from 'react'
import { isAddress } from '@1hive/1hive-ui'
import { getProfileForAccount } from '@lib/profile'

export default function useProfile(account) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!account || !isAddress(account)) {
      return
    }

    let cancelled = false
    async function fetchProfile() {
      const profile = await getProfileForAccount(account)
      if (profile && !cancelled) {
        setProfile(profile)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [account])

  return profile
}
