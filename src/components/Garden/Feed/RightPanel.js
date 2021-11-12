import React, { useMemo } from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import Delegation from './Delegation'
import HeroBanner from './HeroBanner'
import WrapToken from './WrapToken'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

function RightPanel({
  onClaimRewards,
  onRemoveDelegate,
  onRequestNewProposal,
  onSetDelegate,
  onUnwrapToken,
  onWrapToken,
}) {
  const { account } = useWallet()
  const { wrappableToken } = useGardenState() // Todo find a better way to identify a byot gardes rather than just using the wrappable token attr
  const showWrapComponent = account && wrappableToken

  const { layoutName } = useLayout()
  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const largeMode = layoutName === 'large' || layoutName === 'max'

  const styles = useMemo(() => {
    if (largeMode) {
      return {
        display: 'flex',
        flexDirection: 'column',
        marginTop: `${3 * GU}px`,
        position: 'sticky',
        rowGap: `${3 * GU}px`,
        top: `${3 * GU}px`,
        width: '327px',
      }
    }
    if (tabletMode) {
      return {
        display: 'grid',
        gridGap: `${3 * GU}px`,
        gridTemplateColumns: account ? '1fr 1fr' : '1fr',
        marginTop: account ? `${3 * GU}px` : 0,
        padding: account ? `0px ${3 * GU}px` : 0,
        width: '100%',
      }
    }
    if (mobileMode) {
      return {
        display: 'grid',
        gridRowGap: `${3 * GU}px`,
        gridTemplateColumns: '1fr',
        marginTop: `${3 * GU}px`,
        width: '100%',
      }
    }
  }, [account, largeMode, mobileMode, tabletMode])

  return (
    <div style={styles}>
      {showWrapComponent && (
        <div>
          <WrapToken
            onClaimRewards={onClaimRewards}
            onUnwrapToken={onUnwrapToken}
            onWrapToken={onWrapToken}
          />
        </div>
      )}
      {account && (
        <div>
          <Delegation
            onRemoveDelegate={onRemoveDelegate}
            onSetDelegate={onSetDelegate}
          />
        </div>
      )}
      <div>
        <HeroBanner onRequestNewProposal={onRequestNewProposal} />
      </div>
    </div>
  )
}

export default RightPanel
