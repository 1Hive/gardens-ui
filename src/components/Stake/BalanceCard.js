import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  GU,
  Help,
  Switch,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useUniswapHnyPrice } from '../../hooks/useUniswapHNYPrice'
import { formatTokenAmount } from '../../utils/token-utils'
import tokenIcon from '../../assets/honey.svg'

function BalanceCard({
  allowance,
  locked,
  stakeActions,
  total,
  tokenDecimals,
  tokenSymbol,
  onDepositOrWithdraw,
}) {
  const [allowLockManager, setAllowLockManager] = useState(allowance.gt(0))
  const theme = useTheme()
  const tokenRate = useUniswapHnyPrice()

  const allowManagerDisabled = useMemo(() => {
    return locked.gt(0)
  }, [locked])

  const handleOnDeposit = useCallback(() => {
    onDepositOrWithdraw('deposit')
  }, [onDepositOrWithdraw])

  const handleOnWithdraw = useCallback(() => {
    onDepositOrWithdraw('withdraw')
  }, [onDepositOrWithdraw])

  const handleOnAllowLockManager = useCallback(async () => {
    if (!allowLockManager) {
      await stakeActions.allowManager()
    } else {
      await stakeActions.unlockAndRemoveManager()
    }
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

      <div
        css={`
          display: flex;
          ${textStyle('body2')};
          width: 100%;
          align-items: center;
          margin-top: ${5 * GU}px;
        `}
      >
        <Switch
          checked={allowLockManager}
          onChange={handleOnAllowLockManager}
          disabled={allowManagerDisabled}
        />
        <span
          css={`
            margin-left: ${1.5 * GU}px;
            color: ${theme.help};
            font-weight: 600;
          `}
        >
          Allow Lock Manager
        </span>
        <div
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          <Help>
            {allowManagerDisabled
              ? `You cannot disallow the lock manager at this time because you have some collateral locked for scheduled proposals. Once the challenge or dispute is resolved, you’ll be able to disable the lock manager and withdraw your full balance.`
              : `By enabling this feature you allow the Agreement as the lock manager
            of the HNY staking pool. Any required amount to pay for actions
            collateral and submission fees, will be directly locked when
            proposing actions.`}
          </Help>
        </div>
      </div>
    </Card>
  )
}

export default BalanceCard
