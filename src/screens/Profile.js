import React, { useCallback, useEffect, useState } from 'react'
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
import useSelectedProfile from '../hooks/useSelectedProfile'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'

import profileHeaderSvg from '../assets/profileHeader.svg'

function Profile() {
  const [editMode, setEditMode] = useState(false)

  const history = useHistory()
  const { name: layout } = useLayout()
  const { account: connectedAccount } = useWallet()
  const oneColumn = layout === 'small' || layout === 'medium'

  // Selected account
  const query = useQuery()
  const selectedAccount = query.get('account')
  const accountStakes = useAccountStakes(selectedAccount || connectedAccount)

  const selectedProfile = useSelectedProfile(
    selectedAccount || connectedAccount
  )

  useEffect(() => {
    if (!connectedAccount && !selectedAccount) {
      return history.push('/')
    }
  }, [connectedAccount, history, selectedAccount])

  const toggleEditMode = useCallback(() => {
    setEditMode(mode => !mode)
  }, [])

  const isConnectedAccountProfile =
    (connectedAccount && !selectedAccount) ||
    addressesEqual(connectedAccount, selectedAccount)

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
            {isConnectedAccountProfile && (
              <SyncIndicator
                label="Opening box..."
                visible={!selectedProfile?.authenticated}
              />
            )}
            {editMode ? (
              <EditProfile onBack={toggleEditMode} profile={selectedProfile} />
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
                  primary={
                    <Activity account={selectedAccount || connectedAccount} />
                  }
                  secondary={
                    <>
                      <MainProfile profile={selectedProfile} />
                      <Wallet
                        account={selectedAccount || connectedAccount}
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

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export default Profile
