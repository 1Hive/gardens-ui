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

import Carousel from '@components/Carousel/Carousel'
import { useGardenState } from '@providers/GardenState'
import useUnipoolRewards from '@/hooks/useUnipoolRewards'

import { formatTokenAmount } from '@utils/token-utils'

import wrappedIcon from '@assets/wrappedIcon.svg'
import unwrappedIcon from '@assets/unwrappedIcon.svg'
import claimRewardsIcon from '@assets/rewardsWrapperIcon.svg'
import tokenAPRIcon from '@assets/tokenRewardIcon.png'


const TokenHeaderDiv = styled.div`
  display: flex;
  align-items: center;
`
const AprSpan = styled.span`
  margin-left: ${0.5 * GU}px
`

function WrapToken({ onClaimRewards, onUnwrapToken, onWrapToken }) {
  const { token, wrappableToken } = useGardenState()

  const loading =
    token.accountBalance.eq(-1) || wrappableToken.accountBalance.eq(-1)

  const [earnedRewards, rewardsLink, rewardAPR] = useUnipoolRewards()
  const rewardAPRFormatted = (rewardAPR && !rewardAPR.eq(0)) ? rewardAPR.multipliedBy(100).toFixed(2) : null
  const unwrappedImage = (rewardAPR && !rewardAPR.eq(0)) ? tokenAPRIcon : unwrappedIcon

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
        apr: rewardAPRFormatted
      }}
      onClick={onWrapToken}
      token={wrappableToken.data}
    />,
    <Token
      balance={token.accountBalance}
      loading={loading}
      mode={{
        type: 'wrapped',
        icon: wrappedIcon, 
        button: { mode: 'strong', label: 'Unwrap' },
        hint:'This amount can be used to vote on proposals. It can be unwrapped at any time.'
      }}
      onClick={onUnwrapToken}
      token={token.data}
    />,
    <Token
      balance={earnedRewards}
      loading={!earnedRewards}
      mode={{
        type: 'claim',
        icon: claimRewardsIcon, 
        button: { mode: 'normal', label: 'Claim' }    
      }}
      onClick={handleClaimRewards}
      token={wrappableToken.data}
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

function Token({ balance, loading, mode, onClick, token }) {
  const theme = useTheme()
  const { icon, button, hint, apr} = mode
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
      {
        <TokenHeaderDiv>
          <img src={icon} height="48" width="48" /> 
          {apr && <AprSpan>{apr}% APR</AprSpan>}
        </TokenHeaderDiv>
      }
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
