import React, { useCallback, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  Link,
  Modal,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import BigNumber from '../lib/bigNumber'
// import { toDecimals } from '../utils/math-utils'

// import { useAppState } from '../providers/AppState'

const DEFAULT_DEPOSIT_TYPE = 1

const DEFAULT_FORM_DATA = {
  proposalType: DEFAULT_DEPOSIT_TYPE,
  amount: {
    value: '0',
    valueBN: new BigNumber(0),
  },
}

function DepositModal({ formType }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const theme = useTheme()

  const handleAmountChange = useCallback(event => {
    const amount = event.target.value
    setFormData(formData => ({ ...formData, amount: amount }))
  }, [])

  const handleMaxClick = useCallback(event => {
    // This is temporal, do something for getting the max ammount available.
    const amount = event.target.value
    setFormData(formData => ({ ...formData, amount: amount }))
  }, [])

  const handleFormSubmit = useCallback(async event => {
    // do something with the data.
    event.preventDefault()
  }, [])

  const showModal = true

  const renderTitle = () => {
    if (formType === DEFAULT_DEPOSIT_TYPE) {
      return <h2 css={textStyle('title2')}>Deposit HNY as collateral</h2>
    } else {
      return <h2 css={textStyle('title2')}>Withdraw HNY</h2>
    }
  }

  const renderBalance = balance => {
    if (formType === DEFAULT_DEPOSIT_TYPE) {
      return (
        <div
          css={`
                  text-align: left;
                  ${textStyle('body3')}
                  color: ${theme.contentSecondary}
                `}
        >
          Your account balance is ${balance} HNY
        </div>
      )
    } else {
      return (
        <div
          css={`
                  text-align: left;
                  ${textStyle('body3')}
                  color: ${theme.contentSecondary}
                `}
        >
          Your available balance is ${balance} ANT.
        </div>
      )
    }
  }

  const buttonText = () => {
    return formType === DEFAULT_DEPOSIT_TYPE ? 'Deposit' : 'Withdraw'
  }

  return (
    <>
      <Modal visible={showModal} title="Create post" css="margin-top: 40px;">
        <form onSubmit={handleFormSubmit}>
          {renderTitle()}
          <div
            css={`
              margin-top: ${2 * GU}px;
              ${textStyle('body2')}
            `}
          >
            This amount will be placed in the staking pool and will be used to
            pay for actions collateral and submission fees, when proposing
            actions bound by this organization's Agreement.
          </div>
          <Field
            label="AMOUNT"
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <TextInput
              value={formData.amount.value}
              onChange={handleAmountChange}
              required
              wide
              adornment={
                <span
                  css={`
                    color: ${theme.link};
                    padding: 7px ${1.5 * GU}px;
                    cursor: pointer;
                  `}
                  onClick={handleMaxClick}
                >
                  MAX
                </span>
              }
              adornmentPosition="end"
              adornmentSettings={{ padding: 1 }}
            />
          </Field>
          {renderBalance('12')}
          {formType !== DEFAULT_DEPOSIT_TYPE && (
            <Info
              css={`
                margin-top: ${3.5 * GU}px;
              `}
            >
              These votes are purely informative and will not directly result in
              any further action being taken in the organization. These
              proposals can be challenged if not adhered to{' '}
              <Link href="https://forum.1hive.org/new-topic?category=proposals">
                this organization’s Agreement
              </Link>{' '}
              .
            </Info>
          )}
          <Button
            label={buttonText()}
            mode="strong"
            type="submit"
            css={`
              margin-top: ${3.125 * GU}px;
              margin-bottom: ${3.125 * GU}px;
              width: 100%;
            `}
          />
        </form>
      </Modal>
    </>
  )
}

export default DepositModal
