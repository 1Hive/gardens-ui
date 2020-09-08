import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, GU, Split, SyncIndicator, useLayout } from '@1hive/1hive-ui'

import Activity from '../components/Profile/Activity'
import EditProfile from '../components/Profile/EditProfile'
import MainProfile from '../components/Profile/MainProfile'
import StakingTokens from '../components/Profile/StakingTokens'
import Wallet from '../components/Wallet'

import { useMyStakes } from '../hooks/useStakes'
import { useProfile } from '../providers/Profile'

function Profile() {
  const [editMode, setEditMode] = useState(false)

  const history = useHistory()
  const { name: layout } = useLayout()
  const { account, auth, authenticated, box } = useProfile()
  const oneColumn = layout === 'small' || layout === 'medium'

  const myStakes = useMyStakes()

  useEffect(() => {
    if (!account) {
      return history.push('/')
    }
  }, [account, auth, box, history])

  const toggleEditMode = useCallback(() => {
    setEditMode(mode => !mode)
  }, [])

  return (
    <div>
      <SyncIndicator label="Opening box..." visible={!authenticated} />
      {editMode ? (
        <EditProfile onBack={toggleEditMode} />
      ) : (
        <>
          <div
            css={`
              text-align: right;
              margin-bottom: ${2 * GU}px;
            `}
          >
            <Button
              label="Edit profile"
              onClick={toggleEditMode}
              disabled={!authenticated}
            />
          </div>
          <Split
            primary={<Activity />}
            secondary={
              <>
                <MainProfile />
                <Wallet myStakes={myStakes} />
                <StakingTokens myStakes={myStakes} />
              </>
            }
            invert={oneColumn ? 'vertical' : 'horizontal'}
          />
        </>
      )}
    </div>
  )
}

export default Profile
