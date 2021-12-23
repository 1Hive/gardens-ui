import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import { useTheme } from '@1hive/1hive-ui'

import { dateFormat } from '@utils/date-utils'
import { buildGardenPath } from '@utils/routing-utils'

import iconCheck from '@assets/iconCheck.svg'
import iconError from '@assets/iconError.svg'

import InfoBox from './InfoBox'

function AgreementStatus({ agreement }) {
  const history = useHistory()
  const theme = useTheme()
  const { signedLatest, singedPreviousVersion, lastSignatureDate } = agreement

  const goToAgreement = useCallback(() => {
    const path = buildGardenPath(history.location, 'covenant')
    history.push(path)
  }, [history])

  const infoData = useMemo(() => {
    if (!signedLatest && !singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: iconError,
        text: 'You have not signed the newest covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (signedLatest) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: iconCheck,
        text: `You signed this organization’s Covenant on ${dateFormat(
          lastSignatureDate
        )}.`,
      }
    }
  }, [
    lastSignatureDate,
    signedLatest,
    singedPreviousVersion,
    theme,
    goToAgreement,
  ])

  return <InfoBox data={infoData} />
}

export default AgreementStatus
