import React from 'react'
import { useProfile } from '../providers/Profile'

function Profile() {
  const { account, name } = useProfile()
  return (
    <div>
      {account} {name}
    </div>
  )
}

export default Profile
