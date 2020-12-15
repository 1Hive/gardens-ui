import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { addressesEqual } from '../utils/web3-utils'
import { toMs, durationToHours } from '../utils/date-utils'
import { getAppPresentation } from '../utils/app-utils'
import { useAppState } from '../providers/AppState'
import { useMounted } from './useMounted'
import { useAgreementSubscription } from '../providers/AgreementSubscription'
import { getAppByName } from '../utils/data-utils'
import env from '../environment'

export function useAgreement() {
  const mounted = useMounted()
  const { installedApps: apps } = useAppState()
  const agreementApp = getAppByName(apps, env('AGREEMENT_APP_NAME'))

  const [agreement, { loading: agreementLoading }] = useAgreementSubscription()
  console.log('agreement subscription ', agreement)
  const [processedAgreement, setProcessedAgreement] = useState({})
  const [initialProcessing, setInitialProcessing] = useState(true)

  useEffect(() => {
    function processAgreementDetails() {
      const {
        currentVersion,
        appsWithRequirements,
        signer,
        stakingFactory,
      } = agreement
      const { content, effectiveFrom, title, versionId } = currentVersion

      const disputableAppsWithRequirements = processDisputableApps(
        apps,
        appsWithRequirements
      )

      console.log(
        'disputableAppsWithRequirements ',
        disputableAppsWithRequirements
      )

      if (mounted()) {
        setProcessedAgreement({
          contractAddress: agreementApp.address,
          contentIpfsUri: ethersUtils.toUtf8String(content),
          disputableAppsWithRequirements: disputableAppsWithRequirements,
          effectiveFrom: toMs(effectiveFrom),
          stakingAddress: stakingFactory,
          signed: Boolean(signer),
          title: title,
          versionId: versionId,
        })

        // We only want to trigger the loading state on first pass
        // any further updates will replace in place without triggering the loading flag
        setInitialProcessing(false)
      }
    }

    if (!agreementLoading) {
      processAgreementDetails()
    }
  }, [apps, agreement, agreementApp, mounted, agreementLoading])

  return [processedAgreement, initialProcessing]
}

function processDisputableApps(apps, disputableApps) {
  // Add presentation information and value formatting for each app
  const processedDisputableApps = disputableApps.map(disputableApp => {
    const {
      address: disputableAppAddress,
      challengeDuration,
      actionAmount,
      challengeAmount,
      token,
    } = disputableApp

    const targetApp = apps.find(({ address }) =>
      addressesEqual(address, disputableAppAddress)
    )

    console.log('target App ', targetApp)
    const { iconSrc, humanName } = getAppPresentation(targetApp)

    return {
      address: disputableAppAddress,
      appName: humanName,
      actionAmount: actionAmount,
      challengeAmount: challengeAmount,
      settlementPeriodHours: durationToHours(toMs(challengeDuration)),
      iconSrc: iconSrc,
      token: token,
    }
  })

  return processedDisputableApps
}
