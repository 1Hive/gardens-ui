import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getProfile } from '3box'

import { useWallet } from './Wallet'
import { IPFS_ENDPOINT } from '../endpoints'

const ProfileContext = React.createContext()

function ProfileProvider({ children }) {
  const { account } = useWallet()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function getProfileForAccount() {
      if (account) {
        const profile = await getProfile(account)
        const parsedData = parseProfileData(profile)

        if (!cancelled) {
          setProfile(parsedData)
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

function parseProfileData(profile) {
  let image

  if (profile.image.length > 0) {
    image = `${IPFS_ENDPOINT}/${profile.image[0].contentUrl['/']}`
  }

  return { ...profile, image }
}

export { ProfileProvider, useProfile }
