import React, { useCallback } from 'react'
import {
  Box,
  Button,
  GU,
  Help,
  LoadingRing,
  useLayout,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import Carousel from '@/components/Carousel/Carousel'
import { useGardenState } from '@providers/GardenState'
import useUnipoolRewards from '@/hooks/useUnipoolRewards'

import { formatTokenAmount } from '@utils/token-utils'

import wrappedIcon from '@assets/wrappedIcon.svg'
import unwrappedIcon from '@assets/unwrappedIcon.svg'
import claimRewardsIcon from '@assets/activity/light/claimRewards.svg'

function WrapToken({
  onClaimRewards,
  onUnwrapToken,
  onWrapToken,
  itemWidth,
  itemHeight,
}) {
  const { layoutName } = useLayout()
  const { token, wrappableToken } = useGardenState()

  const loading =
    token.accountBalance.eq(-1) || wrappableToken.accountBalance.eq(-1)

  const compactMode = layoutName === 'small' || layoutName === 'medium'
  const tabletMode = layoutName === 'medium'

  const [earnedRewards, rewardsLink] = useUnipoolRewards()

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
      mode="wrap"
      onClick={onWrapToken}
      token={wrappableToken.data}
    />,
    <Token
      balance={token.accountBalance}
      loading={loading}
      mode="unwrap"
      onClick={onUnwrapToken}
      token={token.data}
    />,
    <Token
      balance={earnedRewards}
      loading={!earnedRewards}
      mode="claim"
      onClick={handleClaimRewards}
      token={wrappableToken.data}
    />,
  ]

  const handleItemSelected = useCallback(
    index => {
      if (index === carouselItems.length - 1) {
      }
    },
    [carouselItems.length]
  )

  return (
    <Box
      css={`
        ${!compactMode && `margin-bottom: ${3 * GU}px;`}
      `}
    >
      <div>
        <Carousel
          itemWidth={18 * GU}
          itemHeight={tabletMode ? 24 * GU : 22 * GU}
          itemSpacing={3 * GU}
          items={carouselItems}
          onItemSelected={handleItemSelected}
        />
      </div>
    </Box>
  )
}

function Token({ balance, loading, mode, onClick, token }) {
  const theme = useTheme()

  const wrapMode = mode === 'wrap'
  const claimMode = mode === 'claim'
  const icon = wrapMode
    ? unwrappedIcon
    : claimMode
    ? claimRewardsIcon
    : wrappedIcon
  const button = wrapMode
    ? { mode: 'strong', label: 'Wrap' }
    : claimMode
    ? { mode: 'strong', label: 'Claim' }
    : { mode: 'normal', label: 'Unwrap' }

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
      <img src={icon} height="48" width="48" />
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
        {!wrapMode && !claimMode && (
          <div
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            <Help>
              This amount can be used to vote on proposals. It can be unwrapped
              at any time.
            </Help>
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
