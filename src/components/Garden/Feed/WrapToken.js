import React, { useCallback } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  Help,
  LoadingRing,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'
import Carousel from '@components/Carousel/Carousel'
import { useGardenState } from '@providers/GardenState'
import useUnipoolRewards from '@/hooks/useUnipoolRewards'

import { formatTokenAmount } from '@utils/token-utils'

import wrappedIcon from '@assets/wrappedIcon.svg'
import wrappedIconDark from '@assets/dark-mode/wrappedIconDark.svg'
import unwrappedIcon from '@assets/unwrappedIcon.svg'
import unwrappedIconDark from '@assets/dark-mode/unwrappedIconDark.svg'
import claimRewardsIcon from '@assets/rewardsWrapperIcon.svg'
import claimRewardsIconDark from '@assets/dark-mode/rewardsWrapperIcon.svg'
import tokenAPRIcon from '@assets/tokenRewardIcon.svg'
import tokenAPRIconDark from '@assets/dark-mode/tokenRewardIcon.svg'

function WrapToken({ onClaimRewards, onUnwrapToken, onWrapToken }) {
  const { token, wrappableToken } = useGardenState()
  const AppTheme = useAppTheme()

  const loading =
    token.accountBalance.eq(-1) || wrappableToken.accountBalance.eq(-1)

  const [earnedRewards, rewardsLink, rewardAPR] = useUnipoolRewards()
  const rewardAPRFormatted =
    rewardAPR && !rewardAPR.eq(0)
      ? rewardAPR.multipliedBy(100).toFixed(2)
      : null

  let unwrappedImage
  if (rewardAPR && !rewardAPR.eq(0)) {
    unwrappedImage =
      AppTheme.appearance === 'dark' ? tokenAPRIconDark : tokenAPRIcon
  } else {
    unwrappedImage =
      AppTheme.appearance === 'dark' ? unwrappedIconDark : unwrappedIcon
  }

  const handleClaimRewards = useCallback(() => {
    if (rewardsLink) {
      window.open(rewardsLink)
      return
    }

    onClaimRewards()
  }, [onClaimRewards, rewardsLink])

  const carouselItems = [
    <Token
      balance={wrappableToken.accountBalance}
      loading={loading}
      mode={{
        type: 'unwrapped',
        icon: unwrappedImage,
        button: { mode: 'strong', label: 'Wrap' },
        apr: rewardAPRFormatted,
      }}
      onClick={onWrapToken}
      token={wrappableToken.data}
      darkTheme={AppTheme.appearance === 'dark'}
    />,
    <Token
      balance={token.accountBalance}
      loading={loading}
      mode={{
        type: 'wrapped',
        icon: AppTheme.appearance === 'dark' ? wrappedIconDark : wrappedIcon,
        button: { mode: 'strong', label: 'Unwrap' },
        hint: 'This amount can be used to vote on proposals. It can be unwrapped at any time.',
      }}
      onClick={onUnwrapToken}
      token={token.data}
      darkTheme={AppTheme.appearance === 'dark'}
    />,
    <Token
      balance={earnedRewards}
      loading={!earnedRewards}
      mode={{
        type: 'claim',
        icon:
          AppTheme.appearance === 'dark'
            ? claimRewardsIconDark
            : claimRewardsIcon,
        button: { mode: 'normal', label: 'Claim' },
      }}
      onClick={handleClaimRewards}
      token={wrappableToken.data}
      darkTheme={AppTheme.appearance === 'dark'}
    />,
  ]

  const handleItemSelected = useCallback(
    (index) => {
      // eslint-disable-next-line no-empty
      if (index === carouselItems.length - 1) {
      }
    },
    [carouselItems.length]
  )

  return (
    <Box>
      <div>
        <Carousel
          itemWidth={18 * GU}
          itemHeight={22 * GU}
          itemSpacing={4 * GU}
          items={carouselItems}
          onItemSelected={handleItemSelected}
        />
      </div>
    </Box>
  )
}

function Token({ balance, loading, mode, darkTheme, onClick, token }) {
  const theme = useTheme()
  const { icon, button, hint, apr } = mode
  const claimMode = mode.type === 'claim'

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        ${textStyle('body2')};
      `}
    >
      {apr ? (
        <span css={{ marginLeft: 0.5 * GU }}>
          <div css={{ color: theme.positive }}>% APR</div>
          {apr}
        </span>
      ) : (
        <img src={icon} height="48" width="48" />
      )}
      {loading ? (
        <div
          css={`
            width: 100%;
            margin: ${1 * GU}px 0;
            height: ${3 * GU}px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingRing />
        </div>
      ) : (
        <span
          css={`
            font-weight: 600;
            margin: ${1 * GU}px 0;
            color: ${claimMode ? theme.positive : null};
          `}
        >
          {formatTokenAmount(balance, token.decimals)}
        </span>
      )}
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span>{`${claimMode ? 'Earned ' : ''}${token.symbol}`}</span>
        {hint && (
          <div
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            <Help>{hint}</Help>
          </div>
        )}
      </div>
      <Button
        mode={button.mode}
        wide
        label={button.label}
        onClick={onClick}
        disabled={balance.lte(0)}
        css={`
          margin-top: ${2 * GU}px;
        `}
      />
    </div>
  )
}

export default WrapToken
