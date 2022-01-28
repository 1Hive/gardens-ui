import { useState, useEffect } from 'react'
import { useProfile } from '@providers/Profile'
import { addressesEqual } from '@utils/web3-utils'
import { getProfileForAccount } from '@lib/profile'

const profilesCache: Map<string, any> = new Map([])

export default function useSelectedProfile(account: string) {
  // Connected account's profile (if any)
  const profile = useProfile()

  // Selected account's profile
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  useEffect(() => {
    let cancelled = false

    // Selected account is same as connected account
    // We have already loaded the profile
    if (addressesEqual(account, profile?.account)) {
      return setSelectedProfile(profile)
    }

    async function fetchProfile() {
      if (profilesCache.has(account)) {
        setSelectedProfile(profilesCache.get(account))
        return
      }

      const profile = await getProfileForAccount(account)
      if (!cancelled) {
        setSelectedProfile({ ...profile, account })
        profilesCache.set(account, { ...profile, account })
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [account, profile])

  return selectedProfile
}
