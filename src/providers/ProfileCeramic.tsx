import { SelfID } from '@self.id/web'
import React, { createContext, ReactElement, useContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useConnection, useViewerID, useViewerRecord } from '@self.id/framework'

export type ProfileCeramicProps = {
  connectDID: () => void
  disconnectDID: () => void
  profileDID: SelfID | null
}

export const ProfileCeramicContext = createContext<ProfileCeramicProps | null>(
  null
)

export const ProfileCeramicProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const [connection, connect, disconnect] = useConnection()
  const viewerID = useViewerID()
  const profileRecord = useViewerRecord('basicProfile')

  // connect then set profile into state
  const { storedValue, setValue, removeValue } = useLocalStorage()

  const connectDID = () => {
    connect()
    // set profile in localStorate
    setValue(null)
  }

  const disconnectDID = () => {
    disconnect()
    // remove profile from localStorage
    removeValue()
  }

  return (
    <ProfileCeramicContext.Provider
      value={{ connectDID, disconnectDID, profileDID: storedValue }}
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
