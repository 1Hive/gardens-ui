import React, { useState, useCallback, useMemo } from 'react'
import { TextInput, Field, textStyle, useTheme, GU } from '@1hive/1hive-ui'
import HelpTip from '@components/HelpTip'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import BigNumber from '@lib/bigNumber'
import { durationToHours, toMs } from '@utils/date-utils'
import { formatTokenAmount } from '@utils/token-utils'
import { toDecimals } from '@utils/math-utils'
import { toHex } from 'web3-utils'

function ChallengeRequirements({ getTransactions, proposal }) {
  const theme = useTheme()

  const { collateralRequirement, actionId } = proposal
  const {
    challengeDuration,
    tokenDecimals,
    tokenSymbol,
    challengeAmount,
  } = collateralRequirement

  const settlementPeriodHours = durationToHours(toMs(challengeDuration))
  const maxChallengeAmountFormatted = useMemo(
    () => formatTokenAmount(challengeAmount, tokenDecimals),
    [challengeAmount, tokenDecimals]
  )
  const maxChallengeAmount = maxChallengeAmountFormatted.replace(',', '')

  const [settlementAmount, setSettlementAmount] = useState(maxChallengeAmount)
  const [error, setError] = useState(null)
  const [argument, setArgument] = useState('')
  const [loading, setLoading] = useState(false)
  const { next } = useMultiModal()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const amountBN = new BigNumber(
        toDecimals(settlementAmount, tokenDecimals)
      )
      setLoading(true)

      // Proceed to the next screen after transactions have been received
      // handleChallengeAction(next)

      getTransactions(
        () => {
          next()
        },
        actionId,
        amountBN.toString(10),
        true,
        toHex(argument)
      )
    },
    [argument, next, actionId, getTransactions, settlementAmount, tokenDecimals]
  )

  const handleArgumentChange = useCallback(({ target }) => {
    setArgument(target.value)
  }, [])

  const handleSettlementChange = useCallback(
    ({ target }) => {
      if (isNaN(target.value)) {
        return
      }
      if (
        Number(target.value) < 0 ||
        Number(target.value) > Number(maxChallengeAmount)
      ) {
        setError(true)
      } else {
        setError(null)
      }
      setSettlementAmount(target.value)
    },
    [maxChallengeAmount]
  )

  return (
    <form onSubmit={handleSubmit}>
      <InfoField
        label={
          <>
            Settlement Period
            <HelpTip type="settlement-period" />
          </>
        }
        css={`
          margin-top: ${1 * GU}px;
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <p>
          {settlementPeriodHours}{' '}
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Hours
          </span>
        </p>
      </InfoField>

      <Field
        label={
          <>
            Settlement Offer
            <HelpTip type="settlement-offer" />
          </>
        }
        css={`
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <TextInput
          value={settlementAmount}
          max={maxChallengeAmount}
          wide
          onChange={handleSettlementChange}
          adornment={<> </>}
          adornmentPosition="end"
          adornmentSettings={{ padding: 0.5 * GU }}
          required
        />
        <p
          css={`
            margin-top: ${1 * GU}px;
            color: ${theme.surfaceContentSecondary};
            ${textStyle('body3')};
          `}
        >
          This amount cannot be greater than the proposal creation deposit
          amount : {maxChallengeAmountFormatted} {tokenSymbol}.
        </p>
      </Field>

      <Field
        label="Argument in favour of your challenge"
        css={`
          margin-bottom: 0px;
        `}
      >
        <TextInput
          multiline
          value={argument}
          wide
          onChange={handleArgumentChange}
          required
          css={`
            min-height: ${15 * GU}px;
          `}
        />
      </Field>
      <ModalButton
        mode="strong"
        type="submit"
        loading={loading}
        disabled={error}
      >
        Create transaction
      </ModalButton>
    </form>
  )
}

export default ChallengeRequirements
