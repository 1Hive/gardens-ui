import React, { useCallback, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  Link,
  MEDIUM_RADIUS,
  Modal,
  DropDown,
  TextInput,
  useTheme,
} from '@1hive/1hive-ui'
import BigNumber from '../lib/bigNumber'
// import { toDecimals } from '../utils/math-utils'

// import { useAppState } from '../providers/AppState'

const NULL_PROPOSAL_TYPE = -1
const PROPOSAL = 0

const DEFAULT_FORM_DATA = {
  title: '',
  link: '',
  proposalType: NULL_PROPOSAL_TYPE,
  amount: {
    value: '0',
    valueBN: new BigNumber(0),
  },
  beneficiary: '',
}

function PostModal({ showModal }) {
  const theme = useTheme()
  // const { requestToken } = useAppState()

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const proposalMode = formData.proposalType === PROPOSAL

  const handleTypeChange = useCallback(selected => {
    setFormData(formData => ({
      ...formData,
      proposalType: selected,
    }))
  }, [])

  const handleAmountChange = useCallback(event => {
    const updatedAmount = event.target.value
    setFormData(formData => ({
      ...formData,
      amount: { value: updatedAmount, valueBN: new BigNumber(0) },
    }))
  })
  // CHECK THIS CODE
  // event => {
  //   const updatedAmount = event.target.value

  //   const newAmountBN = new BigNumber(
  //     isNaN(updatedAmount)
  //       ? -1
  //       : toDecimals(updatedAmount, stakeToken.decimals)
  //   )

  //   setFormData(formData => ({
  //     ...formData,
  //     amount: {
  //       value: updatedAmount,
  //       valueBN: newAmountBN,
  //     },
  //   }))
  // },
  // [stakeToken.decimals]
  // )

  const handleTitleChange = useCallback(event => {
    const updatedTitle = event.target.value
    setFormData(formData => ({ ...formData, title: updatedTitle }))
  }, [])

  const handleBeneficiaryChange = useCallback(event => {
    const updatedBeneficiary = event.target.value

    setFormData(formData => ({ ...formData, beneficiary: updatedBeneficiary }))
  }, [])

  const handleLinkChange = useCallback(event => {
    const updatedLink = event.target.value
    setFormData(formData => ({ ...formData, link: updatedLink }))
  }, [])

  const handleFormSubmit = useCallback(async event => {
    event.preventDefault()
  }, [])

  return (
    <>
      <Modal visible={showModal} title="Create post" css="margin-top: 40px;">
        <form onSubmit={handleFormSubmit}>
          <Field label="SELECT TYPE">
            <DropDown
              items={['Proposal']}
              placeholder="Placeholder"
              required
              selected={formData.proposalType}
              onChange={handleTypeChange}
              css={`
                width: 100%;
              `}
            />
          </Field>
          <Field label="Title">
            <TextInput
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              wide
            />
          </Field>
          <Field label="Link">
            <TextInput
              name="link"
              value={formData.link}
              onChange={handleLinkChange}
              wide
            />
          </Field>
          {proposalMode && (
            <>
              <Field label="Requested Amount">
                <TextInput
                  value={formData.amount.value}
                  onChange={handleAmountChange}
                  required
                  wide
                  adornment={
                    <span
                      css={`
                        background: ${theme.background};
                        border-left: 1px solid ${theme.border};
                        border-radius: 0px ${MEDIUM_RADIUS}px ${MEDIUM_RADIUS}px
                          0px;
                        padding: 7px ${1.5 * GU}px;
                      `}
                    >
                      HNY
                    </span>
                  }
                  adornmentPosition="end"
                  adornmentSettings={{ padding: 1 }}
                />
              </Field>
              <Field label="Beneficiary">
                <TextInput
                  onChange={handleBeneficiaryChange}
                  value={formData.beneficiary}
                  wide
                  required
                />
              </Field>
              <Field label="Link">
                <TextInput
                  onChange={handleLinkChange}
                  value={formData.link}
                  wide
                  required
                />
              </Field>
              <Info title="Proposal creation guidelines">
                In order to create a proposal you must first create a post on
                the{' '}
                <Link href="https://forum.1hive.org/new-topic?category=proposals">
                  1Hive Forum
                </Link>{' '}
                under the 🌿 Proposals category and paste the link to the
                corresponding post in the LINK field.
              </Info>
            </>
          )}

          <Button
            label="Continue"
            mode="strong"
            type="submit"
            disabled
            css={`
              margin-top: ${3.125 * GU}px;
              margin-bottom: ${3.125 * GU}px;
              width: 100%;
            `}
          />
          {proposalMode && (
            <Info title="ACTION">
              This action will create a proposal which can be voted on{' '}
              <b>by staking HNY.</b> The action will be executable if the
              accrued total stake is above x% of the total supply of Honey.
            </Info>
          )}
        </form>
      </Modal>
    </>
  )
}

export default PostModal
