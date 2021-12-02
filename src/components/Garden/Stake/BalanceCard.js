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
import useGardenTokenIcon from '@hooks/useGardenTokenIcon'
import { useHoneyswapTokenPrice } from '@hooks/useHoneyswapTokenPrice'
import { formatTokenAmount } from '@utils/token-utils'

function BalanceCard({
  allowance,
  locked,
  stakeActions,
  total,
  tokenAddress,
  tokenDecimals,
  tokenSymbol,
  onDepositOrWithdraw,
}) {
  const [allowLockManager, setAllowLockManager] = useState(allowance?.gt(0))
  const theme = useTheme()
  const tokenPrice = useHoneyswapTokenPrice(tokenAddress)
  const tokenIcon = useGardenTokenIcon({
    id: tokenAddress,
    symbol: tokenSymbol,
  })

  const allowManagerDisabled = useMemo(() => {
    if (!allowLockManager) {
      return false
    }
    if (locked.gt(0)) {
      return true
    }
    return false
  }, [allowLockManager, locked])

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
        $
        {total && tokenPrice > 0
          ? formatTokenAmount(total * tokenPrice, tokenDecimals)
          : '-'}
      </p>
      <Button
        mode="strong"
        wide
        label="Add funds"
        onClick={handleOnDeposit}
        css={`
          margin-top: ${2 * GU}px;
          margin-bottom: ${1.5 * GU}px;
        `}
      />
      <Button
        mode="normal"
        wide
        label="Withdraw funds"
        onClick={handleOnWithdraw}
      />
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
          Give Permission
        </span>
        <div
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          <Help hint="">
            {allowManagerDisabled
              ? `You cannot revoke the deposit manager's ability to lock your funds at this time. You need to wait until your open proposals (proposals you have either created or challenged) have either been completed or removed - scroll to the bottom of the page to see which proposals are concerned.`
              : `By enabling this feature you permit the deposit manager to lock ${tokenSymbol} funds you have deposited on any proposal that you create or challenge. You need to enable this feature to be able to create or challenge a proposal.`}
          </Help>
        </div>
      </div>
    </Card>
  )
}

export default BalanceCard
