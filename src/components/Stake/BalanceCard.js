import React, { useCallback, useState } from 'react'
import { Button, Card, GU, Switch, textStyle, useTheme } from '@1hive/1hive-ui'
import { useUniswapHnyPrice } from '../../hooks/useUniswapHNYPrice'
import { formatTokenAmount } from '../../utils/token-utils'
import tokenIcon from '../../assets/honey.svg'

function BalanceCard({
  stakeActions,
  total,
  tokenDecimals,
  tokenSymbol,
  onDepositOrWithdraw,
}) {
  // getLock
  const [allowLockManager, setAllowLockManager] = useState(false)
  const theme = useTheme()
  const tokenRate = useUniswapHnyPrice()

  const handleOnDeposit = useCallback(() => {
    onDepositOrWithdraw('deposit')
  }, [onDepositOrWithdraw])

  const handleOnWithdraw = useCallback(() => {
    onDepositOrWithdraw('withdraw')
  }, [onDepositOrWithdraw])

  const handleOnAllowLockManager = useCallback(async () => {
    await stakeActions.allowManager()
    setAllowLockManager(!allowLockManager)
  }, [allowLockManager, stakeActions])

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
        {total ? formatTokenAmount(total, tokenDecimals) : '-'}
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
        ${total ? formatTokenAmount(total * tokenRate, tokenDecimals) : '-'}
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

      <div>
        <Switch
          checked={allowLockManager}
          onChange={handleOnAllowLockManager}
        />
      </div>
      <span>Allow Lock Manager</span>
    </Card>
  )
}

export default BalanceCard
