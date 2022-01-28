import useCeramic from '@/hooks/useCeramic'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useWallet } from './Wallet'

export type ProfileType = {
  name?: string
  image?: string
  confirmationFailed?: boolean
  profileExists?: boolean
} | null

type State = {
  profile: ProfileType
  account: string
  auth: () => void
  updateProfile: () => void
}

const ProfileContext = React.createContext<State | undefined | null>(null)

type ProfileProviderProps = {
  children: React.ReactNode
}

function ProfileProvider({ children }: ProfileProviderProps) {
  const { account, ethereum } = useWallet()
  const [profile, setProfile] = useState<ProfileType>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { connectProfile, createProfile } = useCeramic()

  // Authenticate profile
  const auth = useCallback(async () => {
    if (!(account && ethereum)) {
      return
    }

    try {
      const profileData: any = await connectProfile()

      setProfile({
        ...profile,
        ...profileData,
      })
    } catch (err) {
      setProfile({
        ...profile,
        confirmationFailed: true,
      })
    }
  }, [account, ethereum])

  const updateProfile = () => {
    console.log(`updateProfile`)
  }

  useEffect(() => {
    if (!account) {
      return
    }

    auth()
  }, [account, auth])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        account,
        auth,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

function useProfile() {
  return useContext(ProfileContext)
}

export { ProfileProvider, useProfile }
