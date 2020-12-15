import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Info, Checkbox, useLayout, GU } from '@1hive/1hive-ui'
// import InfoField from './../../InfoField'
import ModalButton from '../ModalButton'
import signGraphic from '../../../assets/smart-contract.png'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function SignOverview({ getTransactions }) {
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { layoutName } = useLayout()
  const { next } = useMultiModal()

  const smallMode = layoutName === 'small'

  const handleSign = useCallback(() => {
    setLoading(true)

    // Proceed to the next screen after transactions have been received
    getTransactions(() => {
      next()
    })
  }, [getTransactions, next])

  const handleAcceptTerms = useCallback(
    checked => setAcceptedTerms(checked),
    []
  )

  return (
    <>
      <img
        src={signGraphic}
        css={`
          display: block;
          width: auto;
          height: ${smallMode ? 17 * GU : 20 * GU}px;

          margin: auto;
          margin-bottom: ${5 * GU}px;
        `}
      />
      <label
        css={`
          display: flex;
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div
          css={`
            margin-left: -${0.5 * GU}px;
            margin-right: ${1 * GU}px;
          `}
        >
          <Checkbox checked={acceptedTerms} onChange={handleAcceptTerms} />
        </div>
        By signing this Agreement, you agree to Aragon Network DAO manifesto,
        bylaws and community code of behavior.
      </label>
      {/* <InfoField label="Agreement action collateral"> */}
      <p>
        In order perform or challenge actions bound by this Agreement, you must
        deposit some ANT as the action collateral first. Different apps might
        require different tokens and amounts as the action collateral. You can
        do this at any time on Stake Management.
      </p>
      {/* </InfoField> */}
      <Info
        mode="info"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        These votes are purely informative and will not directly result in any
        further action being taken in the organization. These proposals can be
        challenged if not adhered to this organization’s Agreement.
      </Info>
      <ModalButton
        mode="strong"
        loading={loading}
        onClick={handleSign}
        disabled={!acceptedTerms}
      >
        Sign Agreement
      </ModalButton>
    </>
  )
}

SignOverview.propTypes = {
  getTransactions: PropTypes.func,
}

export default SignOverview
