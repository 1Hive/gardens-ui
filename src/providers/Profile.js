import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getProfile, getVerifiedAccounts } from '3box'

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
        const verifiedAccounts = await getVerifiedAccounts(profile)
        const parsedData = parseProfileData(profile, verifiedAccounts)

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

function parseProfileData(profile, verifiedAccounts) {
  let image

  if (profile.image.length > 0) {
    image = `${IPFS_ENDPOINT}/${profile.image[0].contentUrl['/']}`
  }

  return { ...profile, image, verifiedAccounts }
}

export { ProfileProvider, useProfile }
