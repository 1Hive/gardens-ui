import React, { useContext } from 'react'
import useUser from '@hooks/useUser'
import { useWallet } from './Wallet'
import { useUserGardensSigned } from './Gardens'

const UserContext = React.createContext()

function UserProvider({ children }) {
  const { account } = useWallet()
  const [user, loading, reload] = useUser(account)
  const gardensSignedWithMetadata = useUserGardensSigned(user)

  return (
    <UserContext.Provider
      value={{
        user: { ...user, gardensSigned: gardensSignedWithMetadata },
        loading,
        reload,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

function useUserState() {
  return useContext(UserContext)
}

export { UserProvider, useUserState }
