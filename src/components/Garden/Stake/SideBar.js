import React from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import BalanceCard from './BalanceCard'
import ExpandableCard from './ExpandableCard'
import { useHoneyswapTokenPrice } from '@hooks/useHoneyswapTokenPrice'
import { formatTokenAmount } from '@utils/token-utils'

import coin from './assets/coin.svg'
import wallet from './assets/wallet.svg'

function Sidebar({ stakeActions, staking, token, onDepositOrWithdraw }) {
  const { available, locked, total, allowance } = staking
  const tokenPrice = useHoneyswapTokenPrice(token.id)

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
        tokenAddress={token.id}
        tokenDecimals={token.decimals}
        tokenSymbol={token.symbol}
        onDepositOrWithdraw={onDepositOrWithdraw}
      />
      <ExpandableCard
        content={
          <CardContent
            amount={formatTokenAmount(available * tokenPrice, token.decimals)}
            icon={wallet}
            title={`Available ${token.symbol}`}
            tokenAmount={formatTokenAmount(available, token.decimals)}
          />
        }
        expansion="This is the part of your balance that is not currently being deposited on a proposal or challenge. You may withdraw it at any time."
      />
      <ExpandableCard
        content={
          <CardContent
            amount={formatTokenAmount(locked * tokenPrice, token.decimals)}
            icon={coin}
            title={`Locked ${token.symbol}`}
            secondary
            tokenAmount={formatTokenAmount(locked, token.decimals)}
          />
        }
        expansion="This is the part of your balance that is currently being deposited on either open proposals you have created, or proposals you have challenged. It is not available to be withdrawn."
      />
    </div>
  )
}

function CardContent({ amount, icon, title, secondary, tokenAmount }) {
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
        $ {amount > 0 ? amount : '-'}
      </p>
    </div>
  )
}

export default Sidebar
