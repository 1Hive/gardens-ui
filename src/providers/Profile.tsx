import olduseCeramic from '@/hooks/useCeramic'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useCeramic } from 'use-ceramic'
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
  const ceramic = useCeramic()
  const { connectProfile, createProfile } = olduseCeramic()
  const [authenticated, setAuthenticated] = useState(ceramic.isAuthenticated)
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    const subscription = ceramic.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        setAuthenticated(isAuthenticated)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    console.log('handleLogin:start')
    setProgress(true)
    try {
      await ceramic.authenticate()
    } catch (e) {
      console.error(e)
    } finally {
      console.log('handleLogin:ended')
      setProgress(false)
    }
  }
  const renderButton = () => {
    if (progress) {
      return (
        <>
          <button disabled={true}>Connecting...</button>
        </>
      )
    } else {
      return (
        <>
          <button onClick={handleLogin}>Sign In</button>
        </>
      )
    }
  }
  // Authenticate profile
  const auth = useCallback(async () => {
    // if (!(account && ethereum)) {
    //   return
    // }
    // await handleLogin()
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
