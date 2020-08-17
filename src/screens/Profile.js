import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Split } from '@1hive/1hive-ui'

import Activity from '../components/Profile/Activity'
import MainProfile from '../components/Profile/MainProfile'
import { useProfile } from '../providers/Profile'

function Profile() {
  const { account, auth, box } = useProfile()
  const history = useHistory()

  useEffect(() => {
    if (!account) {
      return history.goBack()
    }

    if (!box) {
      auth()
    }
  }, [account, auth, box, history])

  return (
    <Split
      primary={<Activity />}
      secondary={<MainProfile />}
      invert="horizontal"
    />
  )
}

export default Profile
