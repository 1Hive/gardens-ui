import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, Checkbox, Field, useLayout, useTheme } from '@1hive/1hive-ui'
import ModalButton from '../ModalButton'
import { useGardens } from '@providers/Gardens'
import { useGardenState } from '@providers/GardenState'
import { useAppTheme } from '@providers/AppTheme'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import signGraphicLight from '@assets/smart-contract.svg'
import signGraphicDark from '@assets/dark-mode/smart-contract.svg'

function SignOverview({ getTransactions }) {
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { connectedGarden } = useGardens()
  const { mainToken } = useGardenState()
  const { layoutName } = useLayout()
  const { next } = useMultiModal()
  const theme = useTheme()
  const { appearance } = useAppTheme()

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
        src={appearance === 'light' ? signGraphicLight : signGraphicDark}
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
          <Checkbox
            checked={acceptedTerms}
            onChange={handleAcceptTerms}
            css={`
              border-color: ${theme.accent};
            `}
          />
        </div>
        {`By signing this Covenant, you agree to the ${connectedGarden.name} Community manifesto, by
        laws and community code of behavior.`}
      </label>
      <Field label="Covenant action collateral">
        <p>
          {`In order to perform or challenge actions bound by this Covenant, you
          must deposit some ${mainToken.data.symbol} as the action collateral first. Different apps
          might require different tokens and amounts as the action collateral.`}
        </p>
      </Field>

      <ModalButton
        mode="strong"
        loading={loading}
        onClick={handleSign}
        disabled={!acceptedTerms}
      >
        Sign Covenant
      </ModalButton>
    </>
  )
}

SignOverview.propTypes = {
  getTransactions: PropTypes.func,
}

export default SignOverview
