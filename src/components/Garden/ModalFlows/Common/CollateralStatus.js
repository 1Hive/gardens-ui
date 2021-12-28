import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import { useTheme } from '@1hive/1hive-ui'

import { buildGardenPath } from '@utils/routing-utils'
import { formatTokenAmount } from '@utils/token-utils'

import iconCheck from '@assets/iconCheck.svg'
import iconError from '@assets/iconError.svg'

import InfoBox from './InfoBox'

function CollateralStatus({ allowance, availableStaked, actionAmount, token }) {
  const theme = useTheme()
  const history = useHistory()

  const goToStakeManager = useCallback(() => {
    const path = buildGardenPath(history.location, 'collateral')
    history.push(path)
  }, [history])

  const goToStakeManagerDeposit = useCallback(() => {
    const path = buildGardenPath(history.location, 'collateral/deposit')
    history.push(path)
  }, [history])

  const infoData = useMemo(() => {
    if (!availableStaked.gte(actionAmount)) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: iconError,
        text: `Your enabled account does not have sufficient balance to deposit the ${formatTokenAmount(
          actionAmount,
          token.decimals
        )} ${token.symbol} required for a proposal.`,
        actionButton: 'Add funds',
        buttonOnClick: goToStakeManagerDeposit,
      }
    }

    if (!allowance.gt(0)) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: iconError,
        text: `You need to allow the Covenant as the lock manager of your staked ${token.symbol}`,
        actionButton: 'Deposit manager',
        buttonOnClick: goToStakeManager,
      }
    }

    return {
      backgroundColor: '#EBFBF6',
      color: theme.positive,
      icon: iconCheck,
      text: `Your enabled account has sufficient balance to deposit the ${formatTokenAmount(
        actionAmount,
        token.decimals
      )} ${token.symbol} required for a proposal.`,
    }
  }, [
    actionAmount,
    allowance,
    availableStaked,
    goToStakeManager,
    goToStakeManagerDeposit,
    theme,
    token,
  ])

  return <InfoBox data={infoData} />
}

export default CollateralStatus
