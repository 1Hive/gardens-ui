import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, GU, Split, springs, useLayout } from '@1hive/1hive-ui'
import { animated, Spring } from 'react-spring/renderprops.cjs'
import Activity from './Activity'
import Delegates from './Delegates'
import EditProfile from './EditProfile'
import InactiveProposalsStake from './InactiveProposalsStake'
import MainProfile from './MainProfile'
import StakingTokens from './StakingTokens'

import {
  useAccountStakes,
  useInactiveProposalsWithStake,
} from '@hooks/useStakes'
import usePicture from '@hooks/usePicture'
import useSelectedProfile from '@hooks/useSelectedProfile'
import { useWallet } from '@providers/Wallet'
import { useAppTheme } from '@providers/AppTheme'
import { addressesEqual } from '@utils/web3-utils'

import profileCoverDefaultSvg from '@assets/profileCoverDefault.svg'
import profileCoverDefaultDarkSvg from '@assets/dark-mode/profileCoverDefaultDark.svg'

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [coverPic, onCoverPicChange, onCoverPicRemoval] = usePicture(!editMode)
  const AppTheme = useAppTheme()

  const { account: connectedAccount } = useWallet()
  const router = useRouter()
  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

  const imageInput = useRef(null)

  // Selected account
  const selectedAccount = router.query.account || connectedAccount
  const accountStakes = useAccountStakes(selectedAccount)
  const accountInactiveStakes = useInactiveProposalsWithStake(selectedAccount)

  const selectedProfile = useSelectedProfile(selectedAccount)
  const { coverPhoto } = selectedProfile || {}

  useEffect(() => {
    if (!selectedAccount) {
      return router.push('/')
    }
  }, [connectedAccount, router, selectedAccount])

  useEffect(() => {
    setEditMode(false)
  }, [connectedAccount])

  const toggleEditMode = useCallback(() => {
    setEditMode((mode) => !mode)
  }, [])

  const coverSrc = useMemo(() => {
    if (editMode) {
      if (coverPic.removed) {
        return AppTheme.appearance === 'dark'? profileCoverDefaultDarkSvg : profileCoverDefaultSvg
      }

      if (imageInput.current?.files && imageInput.current.files[0]) {
        return URL.createObjectURL(imageInput.current?.files[0])
      }
    }
    return coverPhoto || AppTheme.appearance === 'dark'? profileCoverDefaultDarkSvg : profileCoverDefaultSvg
  }, [coverPhoto, coverPic, editMode])

  const isConnectedAccountProfile =
    (connectedAccount && !selectedAccount) ||
    addressesEqual(connectedAccount, selectedAccount)

  return (
    <div>
      <AnimatedBackground height={(editMode ? 15 : 50) * GU} image={coverSrc} />
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
                  <Delegates account={selectedAccount} />
                  <StakingTokens
                    myStakes={accountStakes}
                    myInactiveStakes={accountInactiveStakes}
                  />
                </>
              }
              invert={oneColumn ? 'vertical' : 'horizontal'}
            />
          </>
        )}
      </div>
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

export default Profile
