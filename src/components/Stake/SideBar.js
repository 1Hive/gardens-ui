import React from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { useUniswapHnyPrice } from '../../hooks/useUniswapHNYPrice'
import BalanceCard from './BalanceCard'
import ExpandableCard from './ExpandableCard'
import { formatTokenAmount } from '../../utils/token-utils'
import coin from './assets/coin.svg'
import wallet from './assets/wallet.svg'

function Sidebar({ stakeActions, staking, token, onDepositOrWithdraw }) {
  const { available, locked, total, allowance } = staking
  const tokenRate = useUniswapHnyPrice()

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
        allowance={allowance}
        locked={locked}
        stakeActions={stakeActions}
        total={total}
        tokenDecimals={token.decimals}
        tokenSymbol={token.symbol}
        onDepositOrWithdraw={onDepositOrWithdraw}
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
        expansion="This is the part of your collateral balance that has not been locked in any action yet. You may withdraw it at any time."
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
        expansion="This is the part of your collateral balance that is backing a particular action. This Locked amount will move back to Available after the action is finalised if there are no successful challenges."
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
