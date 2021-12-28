/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from 'react'

import connectAgreement from '@1hive/connect-agreement'
import { createAppHook } from '@1hive/connect-react'

import { useMounted } from '@hooks/useMounted'

import { getAppByName } from '@utils/data-utils'

import env from '../environment'
import { getAgreementConnectorConfig } from '../networks'
import { useConnectedGarden } from './ConnectedGarden'
import { useGardenState } from './GardenState'
import { useWallet } from './Wallet'

const AgreementSubscriptionContext = React.createContext()

function AgreementSubscriptionProvider({ children }) {
  const { account } = useWallet()
  const { chainId } = useConnectedGarden()
  const { installedApps } = useGardenState()
  const useAgreement = createAppHook(
    connectAgreement,
    getAgreementConnectorConfig(chainId).agreement
  )
  const agreementApp = getAppByName(installedApps, env('AGREEMENT_APP_NAME'))

  const [currentVersion, currentVersionStatus] = useAgreement(
    agreementApp,
    (app) => app.onCurrentVersion()
  )
  const [disputableApps, disputableAppsStatus] = useAgreement(
    agreementApp,
    (app) => app.onDisputableApps()
  )
  const [stakingFactory, stakingFactoryStatus] = useAgreement(
    agreementApp,
    (app) => app.stakingFactory()
  )
  const [signer, signerStatus] = useAgreement(
    agreementApp,
    (app) => (account ? app.onSigner(account) : null),
    [account]
  )
  const [
    appsWithRequirements,
    { loading: appsWithRequirementsLoading, error: appsWithRequirementsError },
  ] = useAppsWithRequirements(disputableApps)

  // Objects as values to avoid repeated updates on every poll
  const currentVersionUpdateValue = JSON.stringify(currentVersion)
  const signerUpdateValue = JSON.stringify(signer)

  // TODO: Tidy this once we have an improved connect-react api
  const loading =
    currentVersionStatus.loading ||
    disputableAppsStatus.loading ||
    signerStatus.loading ||
    stakingFactoryStatus.loading ||
    appsWithRequirementsLoading

  const error =
    currentVersionStatus.error ||
    disputableAppsStatus.error ||
    signerStatus.error ||
    stakingFactoryStatus.error ||
    appsWithRequirementsError

  if (error) {
    console.error(error)
  }

  // Only update the subscription state object when values have changed
  const AgreementSubscriptionState = useMemo(() => {
    return [
      {
        currentVersion,
        stakingFactory,
        appsWithRequirements,
        signer,
      },
      { loading, error },
    ]
  }, [
    currentVersionUpdateValue,
    appsWithRequirements,
    stakingFactory,
    signerUpdateValue,
    loading,
    error,
  ])

  return (
    <AgreementSubscriptionContext.Provider value={AgreementSubscriptionState}>
      {children}
    </AgreementSubscriptionContext.Provider>
  )
}

function useAppsWithRequirements(disputableApps) {
  const mounted = useMounted()
  const [appsWithRequirements, setAppsWithRequirements] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })

  // Convert to value for use as dependency to avoid updates every poll
  const disputableAppsUpdateValue = JSON.stringify(disputableApps)

  useEffect(() => {
    async function processAppRequirements() {
      if (mounted()) {
        setStatus({ loading: true, error: null })
      }

      try {
        // Concurrently request collateral and token requirements
        const allRequirements = await Promise.all(
          disputableApps.map((app) => app.collateralRequirement())
        )

        const allTokens = await Promise.all(
          allRequirements.map((collateral) => collateral.token())
        )

        // Apply requirements to the disputableApps list
        const appsWithRequirements = disputableApps.map(
          ({ address, currentCollateralRequirementId }) => {
            const {
              challengeAmount,
              actionAmount,
              challengeDuration,
              tokenId,
            } = allRequirements.find(
              ({ id }) => id === currentCollateralRequirementId
            )

            const token = allTokens.find(({ id }) => id === tokenId)

            return {
              address,
              challengeAmount,
              actionAmount,
              token,
              challengeDuration,
            }
          }
        )

        if (mounted()) {
          setAppsWithRequirements(appsWithRequirements)
          setStatus({ loading: false, error: null })
        }
      } catch (err) {
        if (mounted()) {
          setStatus({ loading: false, error: err })
        }
      }
    }

    if (disputableApps) {
      processAppRequirements()
    }
  }, [disputableAppsUpdateValue])

  return [appsWithRequirements, status]
}

function useAgreementSubscription() {
  return useContext(AgreementSubscriptionContext)
}

export { AgreementSubscriptionProvider, useAgreementSubscription }
