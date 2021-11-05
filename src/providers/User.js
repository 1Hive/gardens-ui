import React, { useContext } from 'react'
import { useUser } from '@hooks/useUser'

const UserContext = React.createContext()

function UserProvider({ children }) {
  const [user, loading] = useUser()

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

function useUserState() {
  return useContext(UserContext)
}

export { UserProvider, useUserState }
