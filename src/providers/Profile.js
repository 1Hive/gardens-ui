import React, { useCallback, useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    let cancelled = false

    async function fetchProfileAccount() {
      const profile = await getProfileForAccount(account)

      if (!cancelled) {
        setProfile(profile)
      }
    }

    fetchProfileAccount()

    return () => {
      cancelled = true
    }
  }, [account])

  // Users private data is not accesible unless the user has authenticated
  useEffect(() => {
    if (!box) {
      return
    }

    let cancelled = false

    async function fetchPrivateData() {
      const privateData = await getAccountPrivateData(box)

      if (!cancelled) {
        setProfile(profile => ({ ...profile, ...privateData }))
      }
    }

    fetchPrivateData()

    return () => {
      cancelled = true
    }
  }, [box])

  const auth = useCallback(async () => {
    try {
      const box = await openBoxForAccount(account, ethereum)

      console.log('box', box)

      setBox(box)
    } catch (err) {
      console.error(err)
    }
  }, [account, ethereum])

  return (
    <ProfileContext.Provider value={{ ...profile, account, auth }}>
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
