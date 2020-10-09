import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'

import { useWallet } from './Wallet'
import {
  getAccountPrivateData,
  getProfileForAccount,
  openBoxForAccount,
} from '../lib/profile'
import { useBrightIdVerification } from '../hooks/useBrightIdVerification'

const ProfileContext = React.createContext()

const boxCache = new Map([])

function ProfileProvider({ children }) {
  const { account, ethereum } = useWallet()
  const [box, setBox] = useState(null)
  const [loadingBox, setLoadingBox] = useState(true)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const { sponsorshipInfo, brightIdVerificationInfo } = useBrightIdVerification(
    account
  )

  const cancelled = useRef(false)

  const openBox = useMemo(() => {
    if (!profile || profile.confirmationFailed) {
      return false
    }

    const boxExist = Boolean(box)
    return (
      !loadingProfile && !loadingBox && (!profile.profileExists || !boxExist)
    )
  }, [box, loadingBox, loadingProfile, profile])

  const auth = useCallback(async () => {
    if (!(account && ethereum)) {
      return
    }
    setLoadingBox(true)

    try {
      const box = await openBoxForAccount(account, ethereum)
      boxCache.set(account, box)

      if (!cancelled.current) {
        setBox(box)
      }
    } catch (err) {
      setProfile(profile => ({
        ...profile,
        confirmationFailed: true,
      }))

      console.error(err)
    }
  }, [account, ethereum])

  const fetchAccountProfile = useCallback(async account => {
    setLoadingProfile(true)
    const publicProfile = await getProfileForAccount(account)

    if (!cancelled.current) {
      setProfile(profile => ({
        ...profile,
        ...publicProfile,
      }))
      setLoadingProfile(false)
    }
  }, [])

  const fetchPrivateData = useCallback(async box => {
    const privateData = await getAccountPrivateData(box)

    if (!cancelled.current) {
      setProfile(profile => ({ ...profile, ...privateData }))
    }
  }, [])

  useEffect(() => {
    setProfile(null)
    if (!account) {
      setLoadingProfile(true)
      return
    }

    cancelled.current = false

    fetchAccountProfile(account)

    return () => (cancelled.current = true)
  }, [account, fetchAccountProfile])

  // Users private data is not accesible unless the user has authenticated
  useEffect(() => {
    if (!account) {
      return setBox(null)
    }

    if (boxCache.has(account)) {
      setBox(boxCache.get(account))
      return
    }

    setBox(null)
    auth()
    setLoadingBox(false)
  }, [account, auth])

  useEffect(() => {
    if (box) {
      fetchPrivateData(box)
    }
  }, [box, fetchPrivateData])

  const updateProfile = useCallback(
    async (updatedFields, removedFields) => {
      // Updated fields
      for (const [key, value] of updatedFields.public) {
        await box.public.set(key, value)
      }

      for (const [key, value] of updatedFields.private) {
        await box.private.set(key, value)
      }

      // Removed fields
      for (const key of removedFields.public) {
        await box.public.remove(key)
      }
      for (const key of removedFields.private) {
        await box.private.remove(key)
      }

      return new Promise(resolve => {
        setTimeout(
          () =>
            box.onSyncDone(async () => {
              // re-fetch profile
              await fetchAccountProfile(account)
              await fetchPrivateData(box)

              resolve()
            }),
          2500
        )
      })
    },
    [account, box, fetchAccountProfile, fetchPrivateData]
  )

  // TODO: Add modal for 3box loader
  return (
    <ProfileContext.Provider
      value={{
        ...profile,
        account,
        auth,
        authenticated: Boolean(box),
        brightIdVerificationInfo,
        sponsorshipInfo,
        openBox,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

ProfileProvider.propTypes = {
  children: PropTypes.node,
}

function useProfile() {
  return useContext(ProfileContext)
}

export { ProfileProvider, useProfile }
