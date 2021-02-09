import React from 'react'
import {
  Button,
  Card,
  GU,
  formatTokenAmount,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import tokenIcon from '../../assets/honey.svg'

function BalanceCard({ stakeActions, total, tokenDecimals, tokenSymbol }) {
  const theme = useTheme()
  const tokenRate = 5 // useConvertRate([tokenSymbol])
  // TODO: Replace token icon

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
        css={`
          margin-top: ${2 * GU}px;
          margin-bottom: ${1.5 * GU}px;
        `}
      />
      <Button mode="strong" wide label="Deposit" onClick={stakeActions.stake} />
    </Card>
  )
}

export default BalanceCard
