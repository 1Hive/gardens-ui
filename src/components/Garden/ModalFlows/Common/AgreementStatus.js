import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@1hive/1hive-ui'

import InfoBox from './InfoBox'

import { buildGardenPath } from '@utils/routing-utils'
import { dateFormat } from '@utils/date-utils'

function AgreementStatus({ agreement }) {
  const router = useRouter()
  const theme = useTheme()
  const { signedLatest, singedPreviousVersion, lastSignatureDate } = agreement

  const goToAgreement = useCallback(() => {
    const path = buildGardenPath(router, 'covenant')
    router.push(path)
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
        backgroundColor: theme.positiveContent.alpha(0.8),
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
