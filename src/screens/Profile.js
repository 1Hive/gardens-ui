import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, GU, Split, springs, useLayout } from '@1hive/1hive-ui'
import { animated, Spring } from 'react-spring/renderprops'

import Activity from '../components/Profile/Activity'
import EditProfile from '../components/Profile/EditProfile'
import InactiveProposalsStake from '../components/Profile/InactiveProposalsStake'
import Loader from '../components/Loader'
import MainProfile from '../components/Profile/MainProfile'
import StakingTokens from '../components/Profile/StakingTokens'
import Wallet from '../components/Wallet'

import { useAccountStakes } from '../hooks/useStakes'
import { useAppState } from '../providers/AppState'
import usePicture from '../hooks/usePicture'
import { useInactiveProposalsWithStake } from '../hooks/useProposals'
import useSelectedProfile from '../hooks/useSelectedProfile'
import { useWallet } from '../providers/Wallet'
import { addressesEqual } from '../utils/web3-utils'

import profileCoverDefaultSvg from '../assets/profileCoverDefault.svg'

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [coverPic, onCoverPicChange, onCoverPicRemoval] = usePicture(!editMode)

  const { isLoading } = useAppState()
  const { account: connectedAccount } = useWallet()
  const history = useHistory()
  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

  const imageInput = useRef(null)

  // Selected account
  const searchParams = useSearchParams()
  const selectedAccount = searchParams.get('account') || connectedAccount
  const accountStakes = useAccountStakes(selectedAccount)
  const accountInactiveStakes = useInactiveProposalsWithStake()

  const selectedProfile = useSelectedProfile(selectedAccount)
  const { coverPhoto } = selectedProfile || {}

  useEffect(() => {
    if (!selectedAccount) {
      return history.push('/')
    }
  }, [connectedAccount, history, selectedAccount])

  useEffect(() => {
    setEditMode(false)
  }, [connectedAccount])

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
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <AnimatedBackground
            height={(editMode ? 15 : 50) * GU}
            image={coverSrc}
          />
          <div
            css={`
              margin-top: ${(editMode ? 4 : 20) * GU}px;
              position: relative;
            `}
          >
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
                      position: absolute;
                      z-index: 1;

                      ${oneColumn
                        ? `
                            left: 0;
                            right: 0;
                            text-align: center;
                            top: 50px;
                            `
                        : `
                            top: -54px;
                            right: 0;
                          `}
                    `}
                  >
                    <Button
                      label={
                        selectedProfile?.authenticated
                          ? 'Edit profile'
                          : 'Loading profile…'
                      }
                      onClick={toggleEditMode}
                      disabled={!selectedProfile?.authenticated}
                    />
                  </div>
                )}
                <Split
                  primary={
                    <Activity
                      account={selectedAccount}
                      isConnectedAccount={isConnectedAccountProfile}
                      profileName={selectedProfile?.name}
                    />
                  }
                  secondary={
                    <>
                      <MainProfile profile={selectedProfile} />
                      <Wallet
                        account={selectedAccount}
                        myStakes={accountStakes}
                      />
                      <StakingTokens myStakes={accountStakes} />
                      {accountInactiveStakes.length > 0 && (
                        <InactiveProposalsStake
                          myInactiveStakes={accountInactiveStakes}
                        />
                      )}
                    </>
                  }
                  invert={oneColumn ? 'vertical' : 'horizontal'}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
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
            top: '0',
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
