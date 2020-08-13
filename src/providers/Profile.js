import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getProfile } from '3box'

import { useWallet } from './Wallet'

const ProfileContext = React.createContext()

function ProfileProvider({ children }) {
  const { account } = useWallet()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function getProfileForAccount() {
      if (account) {
        const { name } = await getProfile(account)
        if (!cancelled) {
          setProfile({ name })
        }
      }
    }

    getProfileForAccount()

    return () => {
      cancelled = true
    }
  }, [account])

  return (
    <ProfileContext.Provider value={{ ...profile, account }}>
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
