import React from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { getNetworkName } from '../../utils/web3-utils'
import env from '../../environment'

function DAONotFoundError({ daoId }) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        Garden not found
      </h1>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        It looks like there’s no garden associated with{' '}
        {<span css="font-weight: bold;">“{daoId}”</span>} on the Ethereum{' '}
        {getNetworkName(env('CHAIN_ID'))} network
      </div>
    </React.Fragment>
  )
}

export default DAONotFoundError
