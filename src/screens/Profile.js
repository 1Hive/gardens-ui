import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  GU,
  Split,
  springs,
  SyncIndicator,
  useLayout,
} from '@1hive/1hive-ui'
import { animated, Spring } from 'react-spring/renderprops'

import Activity from '../components/Profile/Activity'
import EditProfile from '../components/Profile/EditProfile'
import MainProfile from '../components/Profile/MainProfile'
import StakingTokens from '../components/Profile/StakingTokens'
import Wallet from '../components/Wallet'

import { useMyStakes } from '../hooks/useStakes'
import { useProfile } from '../providers/Profile'

import profileHeaderSvg from '../assets/profileHeader.svg'

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
    <>
      <AnimatedBackground height={(editMode ? 15 : 50) * GU} />

      <Spring
        config={springs.smooth}
        from={{ transform: `translateY(${20 * GU}px` }}
        to={{ transform: ` translateY(${(editMode ? 4 : 20) * GU}px)` }}
        native
      >
        {({ transform }) => (
          <animated.div style={{ transform }}>
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
          </animated.div>
        )}
      </Spring>
    </>
  )
}

function AnimatedBackground({ height }) {
  return (
    <Spring
      config={springs.smooth}
      from={{ height: `${40 * GU}px` }}
      to={{ height: `${height}px` }}
      native
    >
      {({ height }) => (
        <animated.div
          style={{
            height,
            position: 'absolute',
            top: `62px`,
            left: '0',
            right: '0',

            background: `url(${profileHeaderSvg}) no-repeat`,
            backgroundSize: 'cover',
          }}
        />
      )}
    </Spring>
  )
}

export default Profile
