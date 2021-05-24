import React from 'react'
import { GU } from '@1hive/1hive-ui'

import { formatTokenAmount } from '@utils/token-utils'
import { getTokenIconBySymbol } from '../../utils/token-utils'
import lockIconSvg from '@assets/icon-lock.svg'

function ActionCollateral({ proposal }) {
  const { collateralRequirement } = proposal
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img
        src={getTokenIconBySymbol(collateralRequirement.tokenSymbol)} // TODO: Use deefault-token-list
        alt=""
        height="24"
        width="24"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      <div
        css={`
          margin-right: ${0.5 * GU}px;
        `}
      >
        {formatTokenAmount(
          collateralRequirement.actionAmount,
          collateralRequirement.tokenDecimals
        )}{' '}
        {collateralRequirement.tokenSymbol}
      </div>
      <img src={lockIconSvg} alt="" width="16" height="16" />
    </div>
  )
}

export default ActionCollateral
