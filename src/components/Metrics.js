import React from 'react'
import { Box, GU, textStyle, useLayout, useTheme } from '@aragon/ui'

import honeySvg from '../assets/honey.svg'
import { formatTokenAmount } from '../lib/token-utils'

const Metrics = React.memo(function Metrics({
  totalSupply,
  commonPool,
  onExecuteIssuance,
  stakeToken,
  requestToken,
  totalActiveTokens,
  totalOpenProposals,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <Box
      heading="Honey"
      padding={3 * GU}
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: ${compactMode ? 'block' : 'flex'};
          align-items: center;

          & > div:not(:first-child) {
            width: ${compactMode ? 'auto' : `${30 * GU}px`};
          }
        `}
      >
        <div
          onClick={onExecuteIssuance}
          css={`
            margin-right: ${4 * GU}px;
          `}
        >
          <img src={honeySvg} height="60" width="60" alt="" />
        </div>
        <div>
          <Metric
            label="Token Supply"
            value={formatTokenAmount(totalSupply, stakeToken.decimals)}
          />
        </div>
        <div>
          <Metric
            label="Common Pool"
            value={formatTokenAmount(commonPool, requestToken.decimals)}
          />
        </div>
        <div>
          <Metric label="Open proposals" value={totalOpenProposals} />
        </div>
        <div>
          <Metric
            label="Active"
            value={formatTokenAmount(totalActiveTokens, stakeToken.decimals)}
          />
        </div>
      </div>
    </Box>
  )
})

function Metric({ label, value }) {
  const theme = useTheme()

  return (
    <>
      <p
        css={`
          color: ${theme.contentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </p>
      <span
        css={`
          ${textStyle('title2')};
        `}
      >
        {value}
      </span>
    </>
  )
}

export default Metrics
