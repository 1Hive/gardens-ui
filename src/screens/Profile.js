import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Split } from '@1hive/1hive-ui'

import Activity from '../components/Profile/Activity'
import MainProfile from '../components/Profile/MainProfile'
import { useProfile } from '../providers/Profile'

function Profile() {
  const { name } = useProfile()
  const history = useHistory()

  useEffect(() => {
    if (!name) {
      history.push('/')
    }
  }, [history, name])

  return (
    <Split
      primary={<Activity />}
      secondary={<MainProfile />}
      invert="horizontal"
    />
  )
}

export default Profile
