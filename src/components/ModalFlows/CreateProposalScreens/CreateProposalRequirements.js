import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, GU, Info, Link, textStyle, useTheme } from '@1hive/1hive-ui'
import ModalButton from '../ModalButton'
import InfoField from '../../../components/InfoField'
import { dateFormat } from '../../../utils/date-utils'

import iconError from '../../../assets/iconError.svg'
import iconCheck from '../../../assets/iconCheck.svg'

function CreateProposalRequirements({ agreement }) {
  console.log('agreement!!  ', agreement)
  return (
    <div>
      <InfoField label={<>Agreement signature and version</>}>
        You must sign the{' '}
        <Link href="#/agreement" external={false}>
          community covenant
        </Link>{' '}
        in order to create a post. The Covenant was last updated at{' '}
        {dateFormat(agreement.effectiveFrom)}
      </InfoField>
      <AgreementStatus agreement={agreement} />
      <ModalButton
        mode="strong"
        loading={false}
        onClick={() => {}}
        disabled={false}
      >
        Continue
      </ModalButton>
    </div>
  )
}

function AgreementStatus({ agreement }) {
  const history = useHistory()
  const theme = useTheme()
  const { signedLatest, singedPreviousVersion } = agreement

  const goToAgreement = useCallback(() => {
    history.push('/agreement')
  }, [history])

  const infoData = useMemo(() => {
    if (!signedLatest && !singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the agreement.',
        actionButton: 'Sign Agreement',
        buttonOnClick: goToAgreement,
      }
    }
    if (singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface,
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the newest agreement.',
        actionButton: 'Sign Agreement',
        buttonOnClick: goToAgreement,
      }
    }
    if (signedLatest) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: 'You signed this organization’s Agreement on 2020/05/20.',
      }
    }
  }, [signedLatest, singedPreviousVersion, theme, goToAgreement])

  return (
    <Info
      background={infoData.backgroundColor}
      borderColor="none"
      color={infoData.color}
      css={`
        border-radius: ${0.5 * GU}px;
        margin-top: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          ${textStyle('body2')};
        `}
      >
        <img src={infoData.icon} width="18" height="18" />
        <span
          css={`
            margin-left: ${1.5 * GU}px;
          `}
        >
          {infoData.text}
        </span>
        {infoData.actionButton && (
          <div
            css={`
              margin-left: auto;
            `}
          >
            <Button
              css={`
                border-radius: ${0.5 * GU}px;
              `}
              onClick={infoData.buttonOnClick}
            >
              {infoData.actionButton}
            </Button>
          </div>
        )}
      </div>
    </Info>
  )
}

export default CreateProposalRequirements
