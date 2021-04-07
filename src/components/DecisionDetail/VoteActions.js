import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  GU,
  IconCheck,
  IconConnect,
  IconCross,
  Info,
  RADIUS,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useAppState } from '../../providers/AppState'
import useExtendedVoteData from '../../hooks/useExtendedVoteData'
import { useWallet } from '../../providers/Wallet'
import { noop, dateFormat } from '../../utils/date-utils'
import { VOTE_NAY, VOTE_YEA } from '../../constants'
import { getConnectedAccountVote, isVoteAction } from '../../utils/vote-utils'

const VoteActions = React.memo(({ vote, onVoteYes, onVoteNo, onExecute }) => {
  const [ready, setReady] = useState(false)
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const { stakeToken } = useAppState()

  const connectedAccountVote = getConnectedAccountVote(vote, connectedAccount)

  const { hasEnded, snapshotBlock } = vote
  const {
    canUserVote,
    canExecute,
    userBalance,
    userBalanceNow,
    canUserVotePromise,
    userBalancePromise,
    userBalanceNowPromise,
    canExecutePromise,
    startTimestamp,
  } = useExtendedVoteData(vote)

  const hasVoted = [VOTE_YEA, VOTE_NAY].includes(connectedAccountVote)

  useEffect(() => {
    let cancelled = false

    const whenReady = async () => {
      try {
        await Promise.all([
          canUserVotePromise,
          canExecutePromise,
          userBalancePromise,
          userBalanceNowPromise,
        ])
        if (!cancelled) {
          setReady(true)
        }
      } catch (err) {
        console.error(`Error fetching voting extended data ${err}`)
      }
    }
    whenReady()

    return () => {
      cancelled = true
    }
  }, [
    userBalancePromise,
    canUserVotePromise,
    canExecutePromise,
    userBalanceNowPromise,
  ])

  if (!ready) {
    return null
  }

  if (hasEnded) {
    return (
      <React.Fragment>
        {connectedAccount && canExecute && isVoteAction(vote) && (
          <React.Fragment>
            <Button
              mode="strong"
              onClick={onExecute}
              wide
              css={`
                margin-top: ${2.5 * GU}px;
              `}
            >
              Enact this vote
            </Button>
            <Info
              css={`
                margin-top: ${2.5 * GU}px;
              `}
            >
              The voting period is closed and the vote has passed.{' '}
              <strong>Anyone</strong> can now enact this vote to execute its
              action.
            </Info>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  if (canUserVote) {
    return (
      <div>
        {connectedAccount ? (
          <React.Fragment>
            <TokenReference
              snapshotBlock={snapshotBlock}
              startDate={new Date(startTimestamp)}
              tokenSymbol={stakeToken.symbol}
              userBalance={userBalance}
              userBalanceNow={userBalanceNow}
            />
            <Buttons onClickYes={onVoteYes} onClickNo={onVoteNo} />
          </React.Fragment>
        ) : (
          <div
            css={`
              border-radius: ${RADIUS}px;
              background: ${theme.background};
              padding: ${3.5 * GU}px ${10 * GU}px;
              text-align: center;
            `}
          >
            <div
              css={`
                ${textStyle('body1')};
              `}
            >
              You must enable your account to vote on this proposal
            </div>
            <div
              css={`
                ${textStyle('body2')};
                color: ${theme.surfaceContentSecondary};
                margin-top: ${2 * GU}px;
              `}
            >
              Connect to your Ethereum provider by clicking on the{' '}
              <strong
                css={`
                  display: inline-flex;
                  align-items: center;
                  position: relative;
                  top: 7px;
                `}
              >
                <IconConnect /> Enable account
              </strong>{' '}
              button on the header. You may be temporarily redirected to a new
              screen.
            </div>
          </div>
        )}
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div>
        <Buttons disabled />
        <Info mode="warning">
          You have already voted and changing vote is not allowed.
        </Info>
      </div>
    )
  }

  return (
    <div>
      <Buttons disabled />
      <Info mode="warning">
        {userBalanceNow > 0
          ? 'Although the currently connected account holds tokens, it'
          : 'The currently connected account'}{' '}
        did not hold any <strong>{stakeToken.tokenSymbol}</strong> tokens when
        this vote began ({dateFormat(new Date(startTimestamp))}) and therefore
        cannot participate in this vote. Make sure your accounts are holding{' '}
        <strong>{stakeToken.tokenSymbol}</strong> at the time a vote begins if
        you'd like to vote using this Voting app.
      </Info>
    </div>
  )
})

const Buttons = ({ onClickYes = noop, onClickNo = noop, disabled = false }) => (
  <ButtonsContainer>
    <VotingButton mode="positive" wide disabled={disabled} onClick={onClickYes}>
      <IconCheck
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      Yes
    </VotingButton>
    <VotingButton mode="negative" wide disabled={disabled} onClick={onClickNo}>
      <IconCross
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      No
    </VotingButton>
  </ButtonsContainer>
)

const ButtonsContainer = styled.div`
  display: flex;
  margin: ${2 * GU}px 0;
`

const TokenReference = ({
  snapshotBlock,
  startDate,
  tokenSymbol,
  userBalance,
  userBalanceNow,
}) => {
  const votingWith = Math.min(userBalance, userBalanceNow)

  return (
    <Info
      css={`
        margin-top: ${2 * GU}px;
      `}
    >
      Voting with{' '}
      <strong>
        {votingWith} {tokenSymbol}
      </strong>
      . Your balance at snapshot taken at block <strong>{snapshotBlock}</strong>{' '}
      at <strong>{dateFormat(startDate)}</strong> is {userBalance} {tokenSymbol}
      {userBalance !== userBalanceNow ? (
        <span>
          Your current balance is{' '}
          <strong>
            {userBalanceNow} {tokenSymbol}
          </strong>
          )
        </span>
      ) : (
        ''
      )}
    </Info>
  )
}

const VotingButton = styled(Button)`
  ${textStyle('body2')};
  width: 50%;
  &:first-child {
    margin-right: ${1 * GU}px;
  }
`

export default VoteActions
