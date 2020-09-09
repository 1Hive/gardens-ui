import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import usePicture from '../hooks/usePicture'
import { useProfile } from '../providers/Profile'

import profileCoverDefaultSvg from '../assets/profileCoverDefault.svg'

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [coverPic, onCoverPicChange, onCoverPicRemoval] = usePicture(!editMode)

  const history = useHistory()
  const { name: layout } = useLayout()
  const { account, auth, authenticated, box, coverPhoto } = useProfile()
  const oneColumn = layout === 'small' || layout === 'medium'

  const imageInput = useRef(null)

  const myStakes = useMyStakes()

  useEffect(() => {
    if (!account) {
      return history.push('/')
    }
  }, [account, auth, box, history])

  const toggleEditMode = useCallback(() => {
    setEditMode(mode => !mode)
  }, [])

  const coverSrc = useMemo(() => {
    if (editMode) {
      if (coverPic.removed) {
        return profileCoverDefaultSvg
      }

      if (imageInput.current?.files && imageInput.current.files[0]) {
        return URL.createObjectURL(imageInput.current?.files[0])
      }
    }
    return coverPhoto || profileCoverDefaultSvg
  }, [coverPhoto, coverPic, editMode])

  return (
    <>
      <AnimatedBackground height={(editMode ? 15 : 50) * GU} image={coverSrc} />

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
              <EditProfile
                coverPic={coverPic}
                coverPicRemovalEnabled={
                  !coverPic.removed &&
                  (coverPhoto || (imageInput?.files && imageInput?.files[0]))
                }
                onBack={toggleEditMode}
                onCoverPicChange={onCoverPicChange}
                onCoverPicRemoval={onCoverPicRemoval}
                ref={imageInput}
              />
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

function AnimatedBackground({ height, image }) {
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
          }}
        >
          <div
            css={`
              background: url(${image}) no-repeat;
              background-size: cover;
              height: 100%;
            `}
          />
        </animated.div>
      )}
    </Spring>
  )
}

export default Profile
