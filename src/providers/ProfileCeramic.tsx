import { SelfID } from '@self.id/web'
import React, { createContext, ReactElement, useContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useConnection, useViewerID, useViewerRecord } from '@self.id/framework'
import { getProfileInfo } from '@/utils/self'
import { useWallet } from 'use-wallet'

export type ProfileCeramicProps = {
  connectDID: () => void
  disconnectDID: () => void
  profileDID: SelfID | null
  account: any
}

export const ProfileCeramicContext = createContext<ProfileCeramicProps>({
  connectDID: () => null,
  disconnectDID: () => null,
  profileDID: null,
  account: null,
})

export const ProfileCeramicProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const { account } = useWallet()
  const [connection, connect, disconnect] = useConnection()
  const viewerID = useViewerID()
  const profileRecord = useViewerRecord('basicProfile')

  // connect then set profile into state
  const { storedValue, setValue, removeValue } = useLocalStorage()

  const connectDID = () => {
    connect()
    // set profile in localStorate
    if (viewerID != null) {
      const userProfile = getProfileInfo(viewerID.id, profileRecord.content)
      console.log(`viewerID`, viewerID)
      console.log(`userProfile`, userProfile)
      setValue(userProfile)
    }
  }

  const disconnectDID = () => {
    disconnect()
    // remove profile from localStorage
    removeValue()
  }

  return (
    <ProfileCeramicContext.Provider
      value={{ connectDID, disconnectDID, profileDID: storedValue, account }}
    >
      {children}
    </ProfileCeramicContext.Provider>
  )
}

export function useProfileCeramicState(): React.ContextType<
  typeof ProfileCeramicContext
> {
  return useContext(ProfileCeramicContext)
}
