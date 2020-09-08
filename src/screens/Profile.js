import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, GU, Split, SyncIndicator, useLayout } from '@1hive/1hive-ui'

import Activity from '../components/Profile/Activity'
import EditProfile from '../components/Profile/EditProfile'
import MainProfile from '../components/Profile/MainProfile'
import StakingTokens from '../components/Profile/StakingTokens'
import Wallet from '../components/Wallet'

import { useAccountStakes } from '../hooks/useStakes'
import useSelectedProfile from '../hooks/useSelectedProfile'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'

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
    <div>
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
            primary={<Activity account={selectedAccount || connectedAccount} />}
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
    </div>
  )
}

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export default Profile
