import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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

import { useAccountStakes } from '../hooks/useStakes'
import usePicture from '../hooks/usePicture'
import useSelectedProfile from '../hooks/useSelectedProfile'
import { useWallet } from '../providers/Wallet'
import { addressesEqual } from '../lib/web3-utils'

import profileCoverDefaultSvg from '../assets/profileCoverDefault.svg'

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [coverPic, onCoverPicChange, onCoverPicRemoval] = usePicture(!editMode)

  const { account: connectedAccount } = useWallet()
  const history = useHistory()
  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

  const imageInput = useRef(null)

  // Selected account
  const searchParams = useSearchParams()
  const selectedAccount = searchParams.get('account') || connectedAccount
  const accountStakes = useAccountStakes(selectedAccount)

  const selectedProfile = useSelectedProfile(selectedAccount)
  const { coverPhoto } = selectedProfile || {}

  useEffect(() => {
    if (!selectedAccount) {
      return history.push('/')
    }
  }, [connectedAccount, history, selectedAccount])

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

  const isConnectedAccountProfile =
    (connectedAccount && !selectedAccount) ||
    addressesEqual(connectedAccount, selectedAccount)

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
            {isConnectedAccountProfile && (
              <SyncIndicator
                label="Opening box..."
                visible={!selectedProfile?.authenticated}
              />
            )}
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
                profile={selectedProfile}
                ref={imageInput}
              />
            ) : (
              <>
                {isConnectedAccountProfile && (
                  <div
                    css={`
                      text-align: right;
                      margin-bottom: ${2 * GU}px;
                    `}
                  >
                    <Button
                      label="Edit profile"
                      onClick={toggleEditMode}
                      disabled={!selectedProfile?.authenticated}
                    />
                  </div>
                )}
                <Split
                  primary={<Activity account={selectedAccount} />}
                  secondary={
                    <>
                      <MainProfile profile={selectedProfile} />
                      <Wallet
                        account={selectedAccount}
                        myStakes={accountStakes}
                      />
                      <StakingTokens myStakes={accountStakes} />
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

function useSearchParams() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export default Profile
