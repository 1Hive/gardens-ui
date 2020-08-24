import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, GU, Split, useLayout } from '@1hive/1hive-ui'

import Activity from '../components/Profile/Activity'
import EditProfile from '../components/Profile/EditProfile'
import MainProfile from '../components/Profile/MainProfile'
import { useProfile } from '../providers/Profile'

function Profile() {
  const [editMode, setEditMode] = useState(false)

  const history = useHistory()
  const { name: layout } = useLayout()
  const { account, auth, box } = useProfile()
  const oneColumn = layout === 'small' || layout === 'medium'

  useEffect(() => {
    if (!account) {
      return history.push('/')
    }

    if (!box) {
      auth()
    }
  }, [account, auth, box, history])

  const toggleEditMode = useCallback(() => {
    setEditMode(mode => !mode)
  }, [])

  return editMode ? (
    <EditProfile onBack={toggleEditMode} />
  ) : (
    <div>
      <div
        css={`
          text-align: right;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Button label="Edit profile" onClick={toggleEditMode} />
      </div>
      <Split
        primary={<Activity />}
        secondary={<MainProfile />}
        invert={oneColumn ? 'vertical' : 'horizontal'}
      />
    </div>
  )
}

export default Profile
