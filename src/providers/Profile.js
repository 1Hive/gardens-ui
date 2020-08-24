import React, {
  useCallback,
  useContext,
  useEffect,
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

const ProfileContext = React.createContext()

function ProfileProvider({ children }) {
  const { account, ethereum } = useWallet()
  const [box, setBox] = useState(null)
  const [profile, setProfile] = useState(null)

  const cancelled = useRef(false)

  const fetchAccountProfile = useCallback(async account => {
    const publicProfile = await getProfileForAccount(account)

    if (!cancelled.current) {
      setProfile(profile => ({ ...profile, ...publicProfile }))
    }
  }, [])

  const fetchPrivateData = useCallback(async box => {
    const privateData = await getAccountPrivateData(box)

    if (!cancelled.current) {
      setProfile(profile => ({ ...profile, ...privateData }))
    }
  }, [])

  useEffect(() => {
    if (!account) {
      return setProfile(null)
    }

    fetchAccountProfile(account)

    return () => {
      cancelled.current = true
    }
  }, [account, fetchAccountProfile])

  // Users private data is not accesible unless the user has authenticated
  useEffect(() => {
    if (!box) {
      return
    }

    fetchPrivateData(box)

    return () => {
      cancelled.current = true
    }
  }, [box, fetchPrivateData])

  const auth = useCallback(async () => {
    try {
      const box = await openBoxForAccount(account, ethereum)

      setBox(box)
    } catch (err) {
      console.error(err)
    }
  }, [account, ethereum])

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

      box.onSyncDone(() => {
        // re-fetch profile
        fetchAccountProfile(account)
        fetchPrivateData(box)
      })
    },
    [account, box, fetchAccountProfile, fetchPrivateData]
  )

  console.log(profile)

  return (
    <ProfileContext.Provider
      value={{ ...profile, account, auth, updateProfile }}
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
