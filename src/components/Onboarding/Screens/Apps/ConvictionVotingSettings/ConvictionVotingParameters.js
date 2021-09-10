import React, { Fragment, useCallback, useState } from 'react'
import { Button, GU, Help, textStyle, useTheme } from '@1hive/1hive-ui'
import AdvancedSettingsModal from './AdvancedSettingsModal'
import ConvictionVotingCharts from './ConvictionVotingCharts'
import { PercentageField, SliderField } from '@components/Onboarding/kit'

const MAX_HALF_LIFE_DAYS = 20

function ConvictionVotingParameters({
  decay,
  stakeOnProposal,
  stakeOnOtherProposals,
  weight,
  halflifeDays,
  handleHalflifeDaysChange,
  maxRatio,
  handleMaxRatioChange,
  minThreshold,
  handleMinThresholdChange,
  minThresholdStakePct,
  handleMinThresholdStakePctChange,
  requestToken,
  handleRequestTokenChange,
  requestedAmount,
  handleRequestedAmountChange,
  handleReset,
}) {
  const theme = useTheme()
  const [modalVisible, setModalVisible] = useState(false)

  const handleOpenModal = useCallback(() => setModalVisible(true), [])

  const handleCloseModal = useCallback(() => setModalVisible(false), [])

  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        margin-left: ${2 * GU}px;
        margin-bottom: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: center;
          flex-direction: column;
        `}
      >
        <SliderField
          label={
            <Fragment>
              Conviction Growth (days)
              <Help hint="What is Conviction Growth?">
                <strong>Conviction Growth</strong> is the number of days it
                takes to accumulate or reduce voting power by 50%. For example,
                if the conviction growth is set to 1 day your tokens must
                support a proposal for 1 day to reach 50% of those tokens' max
                voting power, 2 days to reach 75%, 3 days to reach 87.5%, etc.
              </Help>
            </Fragment>
          }
          minValue={1}
          maxValue={MAX_HALF_LIFE_DAYS}
          value={halflifeDays}
          onChange={handleHalflifeDaysChange}
        />
        <PercentageField
          label={
            <Fragment>
              Spending Limit
              <Help hint="What is Spending Limit?">
                <strong>Spending Limit</strong> is the the maximum percentage of
                total funds an individual proposal can request from the common
                pool.
              </Help>
            </Fragment>
          }
          minValue={1}
          value={maxRatio}
          onChange={handleMaxRatioChange}
        />
        <PercentageField
          label={
            <Fragment>
              Minimum Conviction
              <Help hint="What is Minimum Conviction?">
                <strong>Minimum Conviction</strong> is the mininum percentage of
                tokens that are used for calculating the threshold to pass any
                proposal.
              </Help>
            </Fragment>
          }
          minValue={1}
          value={minThreshold}
          onChange={handleMinThresholdChange}
        />
        <Button
          size="mini"
          onClick={handleOpenModal}
          label="Advanced..."
          css={`
            align-self: flex-end;
          `}
        />
        <AdvancedSettingsModal
          requestToken={requestToken}
          minThresholdStakePct={minThresholdStakePct}
          handleRequestTokenChange={handleRequestTokenChange}
          handleMinThresholdStakePctChange={handleMinThresholdStakePctChange}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
        <div
          css={`
            display: flex;
            flex-direction: column;
            margin-top: ${4 * GU}px;
          `}
        >
          <div
            css={`
              color: ${theme.contentSecondary};
              margin-bottom: ${3 * GU}px;
              ${textStyle('body3')};
            `}
          >
            The next configuration allows you to play with different amounts, it
            is not an actual parameter. It will help you understand the
            significance of the threshold for conviction voting proposals:
          </div>
          <PercentageField
            label={
              <Fragment>
                Requested Amount
                <Help hint="What is Requested Amount?">
                  <strong>Requested Amount</strong> is the percentage of the
                  total supply being requested.
                </Help>
              </Fragment>
            }
            value={requestedAmount}
            onChange={handleRequestedAmountChange}
          />
          <Button
            size="mini"
            onClick={handleReset}
            label="Reset Defaults"
            css={`
              align-self: flex-end;
            `}
          />
        </div>
      </div>
      <div
        css={`
          margin-left: ${5 * GU}px;
        `}
      >
        <ConvictionVotingCharts
          decay={decay}
          maxRatio={maxRatio}
          minActiveStakePct={minThresholdStakePct}
          requestedAmount={requestedAmount}
          stakeOnProposal={stakeOnProposal}
          stakeOnOtherProposals={stakeOnOtherProposals}
          weight={weight}
        />
      </div>
    </div>
  )
}

export default ConvictionVotingParameters
