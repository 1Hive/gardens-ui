import React, { useMemo } from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import Delegation from './Delegation'
import HeroBanner from './HeroBanner'
import WrapToken from './WrapToken'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

const getStyles = (
  layoutName: string,
  account: string
): React.CSSProperties | undefined => {
  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const largeMode = layoutName === 'large' || layoutName === 'max'

  if (largeMode) {
    return {
      display: 'flex',
      flexDirection: 'column',
      marginTop: `${3 * GU}px`,
      position: 'sticky',
      rowGap: `${3 * GU}px`,
      top: `${3 * GU}px`,
      width: '260px',
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
      width: '100%',
    }
  }
}

type RightPanelProps = {
  onClaimRewards: () => void
  onRemoveDelegate: () => void
  onRequestNewProposal: () => void
  onSetDelegate: () => void
  onUnwrapToken: () => void
  onWrapToken: () => void
}

function RightPanel({
  onClaimRewards,
  onRemoveDelegate,
  onRequestNewProposal,
  onSetDelegate,
  onUnwrapToken,
  onWrapToken,
}: RightPanelProps) {
  const { account } = useWallet()
  const { wrappableToken } = useGardenState() // Todo find a better way to identify a byot gardes rather than just using the wrappable token attr
  const showWrapComponent = account && wrappableToken

  const { layoutName } = useLayout()
  const styles = useMemo(
    () => getStyles(layoutName, account),
    [account, layoutName]
  )

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
      <div css={layoutName === 'small' ? 'grid-row: 1' : ''}>
        <HeroBanner onRequestNewProposal={onRequestNewProposal} />
      </div>
      {account && (
        <div>
          <Delegation
            onRemoveDelegate={onRemoveDelegate}
            onSetDelegate={onSetDelegate}
          />
        </div>
      )}
    </div>
  )
}

export default RightPanel
