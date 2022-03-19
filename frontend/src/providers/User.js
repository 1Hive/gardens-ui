import React, { useContext } from 'react'
import useUser from '@hooks/useUser'
import { useWallet } from './Wallet'

const UserContext = React.createContext()

function UserProvider({ children }) {
  const { account } = useWallet()
  const { user, loading, reload } = useUser(account)

  return (
    <UserContext.Provider value={{ user, loading, reload }}>
      {children}
    </UserContext.Provider>
  )
}

function useUserState() {
  return useContext(UserContext)
}

export { UserProvider, useUserState }
