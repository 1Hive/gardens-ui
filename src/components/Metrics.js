import React from 'react'

import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'

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

  const TokenSupply = (
    <div>
      <Metric
        label="Token Supply"
        value={formatTokenAmount(totalSupply, stakeToken.decimals)}
      />
    </div>
  )

  return (
    <Box
      heading="Honey"
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: ${compactMode ? 'block' : 'flex'};
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin-bottom: ${(compactMode ? 2 : 0) * GU}px;
          `}
        >
          <img
            src={honeySvg}
            height="60"
            width="60"
            alt=""
            onClick={onExecuteIssuance}
            css={`
              margin-right: ${4 * GU}px;
              cursor: pointer;
            `}
          />
          {compactMode && TokenSupply}
        </div>
        {!compactMode && TokenSupply}
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
