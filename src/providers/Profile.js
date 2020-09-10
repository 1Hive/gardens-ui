import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'

import { useAppState } from './AppState'
import { useWallet } from './Wallet'
import {
  getAccountPrivateData,
  getProfileForAccount,
  openBoxForAccount,
  openSpaceByName,
} from '../lib/3box'
import { getNetwork } from '../networks'

const ProfileContext = React.createContext()

const boxCache = new Map([])

function getSpaceName(address) {
  return address ? `honeypot-${getNetwork().type}${address}` : ''
}

function ProfileProvider({ children }) {
  const { convictionVoting } = useAppState()
  const { account, ethereum } = useWallet()
  const [box, setBox] = useState(null)
  const [space, setSpace] = useState(null)
  const [profile, setProfile] = useState(null)

  const SPACE_NAME = getSpaceName(convictionVoting?.address)
  const cancelled = useRef(false)

  const auth = useCallback(async () => {
    if (!(account && ethereum)) {
      return
    }

    try {
      const box = await openBoxForAccount(account, ethereum)
      boxCache.set(account, box)

      if (!cancelled.current) {
        setBox(box)
      }
    } catch (err) {
      console.error(err)
    }
  }, [account, ethereum])

  // Fetch account's public data
  const fetchAccountProfile = useCallback(async account => {
    const publicProfile = await getProfileForAccount(account)

    if (!cancelled.current) {
      setProfile(profile => ({ ...profile, ...publicProfile }))
    }
  }, [])

  // Fetch account's private data
  const fetchPrivateData = useCallback(async box => {
    const privateData = await getAccountPrivateData(box)

    if (!cancelled.current) {
      setProfile(profile => ({ ...profile, ...privateData }))
    }
  }, [])

  // Fetch space
  const fetchSpace = useCallback(
    async box => {
      if (!SPACE_NAME) {
        return
      }

      try {
        const space = await openSpaceByName(box, SPACE_NAME)

        if (!cancelled.current) {
          setSpace(space)
        }
      } catch (err) {
        console.error('Failed to open space: ', err)
      }
    },
    [SPACE_NAME]
  )

  // Right after the users connect their account we'll fetch their public data
  useEffect(() => {
    // If users change account we reset the profile
    setProfile(null)
    if (!account) {
      return
    }

    cancelled.current = false

    fetchAccountProfile(account)

    return () => (cancelled.current = true)
  }, [account, fetchAccountProfile])

  // Users private data and space are not accesible unless the user has authenticated
  useEffect(() => {
    if (!account) {
      setBox(null)
      setSpace(null)
      return
    }

    if (boxCache.has(account)) {
      setBox(boxCache.get(account))
      return
    }

    setBox(null)
    auth()
  }, [account, auth])

  // After user has authenticated, we'll fetch his/her
  // privtae data and open the honeypot space
  useEffect(() => {
    if (box) {
      fetchPrivateData(box)
      fetchSpace(box)
    }
  }, [box, fetchPrivateData, fetchSpace])

  // Function for updating user's profile
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
        space,
        spaceName: SPACE_NAME,
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
