import { useRouter } from 'next/router'
import { useTheme } from '@1hive/1hive-ui'
import React, { useCallback, useMemo } from 'react'

import InfoBox from './InfoBox'

import { dateFormat } from '@utils/date-utils'

function AgreementStatus({ agreement }) {
  const theme = useTheme()
  const router = useRouter()
  const query = router.query
  const { signedLatest, singedPreviousVersion, lastSignatureDate } = agreement

  const goToAgreement = useCallback(() => {
    router.push(`/${query.networkType}/garden/${query.gardenAddress}/covenant`)
  }, [router])

  const infoData = useMemo(() => {
    if (!signedLatest && !singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: '/icons/base/iconError.svg',
        text: 'You have not signed the covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (singedPreviousVersion) {
      return {
        backgroundColor: theme.negativeSurface.toString(),
        color: theme.negative,
        icon: '/icons/base/iconError.svg',
        text: 'You have not signed the newest covenant.',
        actionButton: 'Sign Covenant',
        buttonOnClick: goToAgreement,
      }
    }
    if (signedLatest) {
      return {
        backgroundColor: '#EBFBF6',
        color: theme.positive,
        icon: '/icons/base/iconCheck.svg',
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
