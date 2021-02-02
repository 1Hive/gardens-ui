import React, { useCallback } from 'react'
import {
  Button,
  Card,
  GU,
  formatTokenAmount,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useUniswapHnyPrice } from '../../hooks/useUniswapHNYPrice'
import tokenIcon from '../../assets/honey.svg'

function BalanceCard({
  stakeActions,
  total,
  tokenDecimals,
  tokenSymbol,
  onDepositOrWithdraw,
}) {
  const theme = useTheme()
  const tokenRate = useUniswapHnyPrice()
  // TODO: Replace token icon

  const handleOnDeposit = useCallback(() => {
    onDepositOrWithdraw('deposit')
  }, [onDepositOrWithdraw])

  const handleOnWithdraw = useCallback(() => {
    onDepositOrWithdraw('withdraw')
  }, [onDepositOrWithdraw])

  return (
    <Card
      css={`
        width: 100%;
        height: auto;
        text-align: center;
        padding: ${3 * GU}px;
      `}
    >
      <img
        src={tokenIcon}
        width={6.5 * GU}
        height={6.5 * GU}
        css={`
          margin: auto;
          margin-bottom: ${1 * GU}px;
        `}
      />
      <h2
        css={`
          ${textStyle('title4')};
        `}
      >
        {formatTokenAmount(total, tokenDecimals)}
      </h2>
      <h1
        css={`
          margin: ${0.5 * GU}px 0;
        `}
      >
        Total {tokenSymbol}
      </h1>
      <p
        css={`
          color: ${theme.positive};
        `}
      >
        $ {formatTokenAmount(total * tokenRate, tokenDecimals)}
      </p>
      <Button
        mode="normal"
        wide
        label="Withdraw"
        onClick={handleOnWithdraw}
        css={`
          margin-top: ${2 * GU}px;
          margin-bottom: ${1.5 * GU}px;
        `}
      />
      <Button mode="strong" wide label="Deposit" onClick={handleOnDeposit} />
    </Card>
  )
}

export default BalanceCard
