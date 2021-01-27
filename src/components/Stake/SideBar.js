import React from 'react'
import { GU, formatTokenAmount, textStyle, useTheme } from '@1hive/1hive-ui'
import BalanceCard from './BalanceCard'
import ExpandableCard from './ExpandableCard'
import coin from './assets/coin.svg'
import wallet from './assets/wallet.svg'

function Sidebar({ stakeActions, staking, token }) {
  const { available, challenged, locked, total } = staking
  const tokenRate = 5 // useConvertRate([token.symbol])

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        grid-gap: ${2 * GU}px;
      `}
    >
      <BalanceCard
        stakeActions={stakeActions}
        total={total}
        tokenDecimals={token.decimals}
        tokenSymbol={token.symbol}
      />
      <ExpandableCard
        content={
          <CardContent
            amount={formatTokenAmount(available * tokenRate, token.decimals)}
            icon={wallet}
            title={`Available ${token.symbol}`}
            tokenAmount={formatTokenAmount(available, token.decimals)}
          />
        }
        expansion="This is the part of your collateral balance that has not been locked in any action yet. You may permissionlessly withdraw it at any time."
      />
      <ExpandableCard
        content={
          <CardContent
            amount={formatTokenAmount(locked * tokenRate, token.decimals)}
            icon={coin}
            title={`Locked ${token.symbol}`}
            tokenAmount={formatTokenAmount(locked, token.decimals)}
            secondary
          />
        }
        expansion="This is the part of your collateral balance that is backing a particular action. This Locked amount will move back to Available after the action is able to be enacted."
      />
      <ExpandableCard
        content={
          <CardContent
            amount={formatTokenAmount(challenged * tokenRate, token.decimals)}
            icon={coin}
            title={`Challenged ${token.symbol}`}
            tokenAmount={formatTokenAmount(challenged, token.decimals)}
            secondary
          />
        }
        expansion="This is the part of your collateral balance that is backing a particular action that has been challenged or disputed in Aragon Court. Part of this amount could be slashed (transferred to the challenger’s account) if the challenge or dispute outcome results in canceling the action."
      />
    </div>
  )
}

function CardContent({ icon, title, tokenAmount, amount, secondary }) {
  const theme = useTheme()
  return (
    <div
      css={`
        text-align: center;
      `}
    >
      <img
        src={icon}
        width={6 * GU}
        height={6 * GU}
        css={`
          margin: auto;
        `}
      />
      <h2
        css={`
          ${textStyle('title4')};
        `}
      >
        {tokenAmount}
      </h2>
      <h1
        css={`
          margin: ${0.5 * GU}px 0;
          color: ${theme.contentSecondary};
        `}
      >
        {title}
      </h1>
      <p
        css={`
          color: ${secondary ? theme.contentSecondary : theme.positive};
        `}
      >
        $ {amount}
      </p>
    </div>
  )
}

export default Sidebar
