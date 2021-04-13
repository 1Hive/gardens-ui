import React from 'react'
import styled from 'styled-components'
import { Accordion, AppBadge, Box, useTheme, GU } from '@1hive/1hive-ui'
import HelpTip from '../HelpTip'
import InfoField from './../InfoField'
import { getNetwork } from '../../networks'
import { formatTokenAmount } from '../../utils/token-utils'

function AgreementBindingActions({ apps }) {
  const network = getNetwork()

  const items = apps.map(
    ({
      address,
      actionAmount,
      challengeAmount,
      humanName,
      iconSrc,
      token,
      settlementPeriodHours,
    }) => [
      <div
        css={`
          display: flex;
          align-items: center;
          margin-left: ${-1 * GU}px;
        `}
      >
        <AppBadge
          iconSrc={iconSrc}
          label={humanName}
          appAddress={address}
          networkType={network.type}
          explorerProvider={network.explorer}
        />
      </div>,

      <div
        css={`
          display: inline-grid;
          width: 100%;
          padding-top: ${3 * GU}px;
          padding-bottom: ${3 * GU}px;
          padding-left: ${1.25 * GU}px;
          grid-auto-flow: row;
          grid-gap: ${3 * GU}px;
        `}
      >
        <InfoField
          label={
            <>
              Action Collateral
              <HelpTip type="action-collateral" />
            </>
          }
        >
          <AmountPerAction amount={actionAmount} token={token} />
        </InfoField>

        <InfoField
          label={
            <>
              Challenge Collateral
              <HelpTip type="challenge-collateral" />
            </>
          }
        >
          <AmountPerAction amount={challengeAmount} token={token} />
        </InfoField>

        <InfoField
          label={
            <>
              Settlement Period
              <HelpTip type="settlement-period" />
            </>
          }
        >
          {settlementPeriodHours} <SubtleLabel>Hours</SubtleLabel>
        </InfoField>
      </div>,
    ]
  )

  return (
    <Box heading="Binding Actions" padding={0}>
      <StyledAccordion>
        <Accordion items={items} />
      </StyledAccordion>
    </Box>
  )
}

/* eslint-disable react/prop-types */
function SubtleLabel({ children }) {
  const theme = useTheme()

  return (
    <span
      css={`
        color: ${theme.surfaceContentSecondary};
      `}
    >
      {children}
    </span>
  )
}

function AmountPerAction({ amount, token }) {
  const { decimals, symbol } = token

  return (
    <div
      css={`
        display: inline-flex;
      `}
    >
      <span>
        {formatTokenAmount(amount, decimals)}
        {` `}
        {symbol}
      </span>

      <SubtleLabel>(per action)</SubtleLabel>
    </div>
  )
}
/* eslint-disable react/prop-types */

const StyledAccordion = styled.div`
  & > div:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }

  & > div:last-child {
    border-bottom: 0;
  }
`

export default AgreementBindingActions
