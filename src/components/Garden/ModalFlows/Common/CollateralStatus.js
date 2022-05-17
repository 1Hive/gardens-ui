import { useRouter } from 'next/router'
import { useTheme } from '@1hive/1hive-ui'
import React, { useCallback, useMemo } from 'react'

import InfoBox from './InfoBox'

import { formatTokenAmount } from '@utils/token-utils'

function CollateralStatus({ allowance, availableStaked, actionAmount, token }) {
  const theme = useTheme()
  const router = useRouter()
  const query = router.query

  const goToStakeManager = useCallback(() => {
    router.push(
      `/${query.networkType}/garden/${query.gardenAddress}/collateral`
    )
  }, [router])

  const goToStakeManagerDeposit = useCallback(() => {
    router.push(
      `/${query.networkType}/garden/${query.gardenAddress}/collateral/deposit`
    )
  }, [router])

  const infoData = useMemo(() => {
    if (!availableStaked.gte(actionAmount)) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: '/icons/base/iconError.svg',
        text: `Your enabled account does not have sufficient balance to deposit the ${formatTokenAmount(
          actionAmount,
          token.decimals
        )} ${token.symbol} required for a decision.`,
        actionButton: 'Add funds',
        buttonOnClick: goToStakeManagerDeposit,
      }
    }

    if (!allowance.gt(0)) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: '/icons/base/iconError.svg',
        text: `You need to allow the Covenant as the lock manager of your staked ${token.symbol}`,
        actionButton: 'Deposit manager',
        buttonOnClick: goToStakeManager,
      }
    }

    return {
      backgroundColor: '#EBFBF6',
      color: theme.positive,
      icon: '/icons/base/iconCheck.svg',
      text: `Your enabled account has sufficient balance to deposit the ${formatTokenAmount(
        actionAmount,
        token.decimals
      )} ${token.symbol} required for a decision.`,
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
