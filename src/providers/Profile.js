import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@1hive/1hive-ui'

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

  const auth = useCallback(async () => {
    if (!(account && ethereum)) {
      return
    }

    try {
      const box = await openBoxForAccount(account, ethereum)
      setBox(box)
    } catch (err) {
      console.error(err)
    }
  }, [account, ethereum])

  const fetchAccountProfile = useCallback(async account => {
    const publicProfile = await getProfileForAccount(account)

    setProfile(profile => ({ ...profile, ...publicProfile }))
  }, [])

  const fetchPrivateData = useCallback(async box => {
    const privateData = await getAccountPrivateData(box)

    setProfile(profile => ({ ...profile, ...privateData }))
  }, [])

  useEffect(() => {
    if (!account) {
      return setProfile(null)
    }

    fetchAccountProfile(account)
  }, [account, fetchAccountProfile])

  // Users private data is not accesible unless the user has authenticated
  useEffect(() => {
    if (!account) {
      setBox(null)
      return
    }

    if (!box) {
      auth()
      return
    }

    fetchPrivateData(box)
  }, [account, auth, box, fetchPrivateData])

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

  // TODO: Add modal for 3box loader
  return (
    <ProfileContext.Provider
      value={{
        ...profile,
        account,
        auth,
        authenticated: Boolean(box),
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
