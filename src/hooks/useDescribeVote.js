import { useEffect, useState, useMemo } from 'react'

import { getAppPresentationByAddress } from '../utils/app-utils'
import { addressesEqual } from '../utils/web3-utils'
import { useMounted } from '../hooks/useMounted'
import { useAppState } from '../providers/AppState'

const cachedDescriptions = new Map([])

export function useDescribeVote(script, voteId) {
  const mounted = useMounted()

  const { organization, installedApps } = useAppState()

  const [description, setDescription] = useState(null)
  const [loading, setLoading] = useState(true)

  const emptyScript = script === '0x00000001' || '0x00'

  // Populate target app data from transaction request
  const targetApp = useMemo(
    () =>
      description
        ? targetDataFromTransactionRequest(installedApps, description[0])
        : null,
    [installedApps, description]
  )

  useEffect(() => {
    if (emptyScript) {
      setLoading(false)
      return
    }

    // Return from cache if description was previously fetched
    if (cachedDescriptions.has(voteId)) {
      if (mounted()) {
        setDescription(cachedDescriptions.get(voteId))
        setLoading(false)
      }

      return
    }

    async function describe() {
      try {
        const { describedSteps } = await organization.describeScript(script)

        if (mounted()) {
          setDescription(describedSteps)
          setLoading(false)

          // Cache vote description to avoid unnecessary future call
          cachedDescriptions.set(voteId, describedSteps)
        }
      } catch (err) {
        console.error(err)
      }
    }

    describe()
  }, [emptyScript, script, voteId, organization, mounted])

  return { description, emptyScript, loading, targetApp }
}

function targetDataFromTransactionRequest(apps, transactionRequest) {
  const { to: targetAppAddress, name, identifier } = transactionRequest

  // Populate details via our apps list if it's available
  if (apps.some(({ address }) => addressesEqual(address, targetAppAddress))) {
    const { humanName, iconSrc } = getAppPresentationByAddress(
      apps,
      targetAppAddress
    )

    return {
      address: targetAppAddress,
      name: humanName,
      icon: iconSrc,
    }
  }

  // Otherwise provide some fallback values
  return {
    address: targetAppAddress,
    name: name || identifier,
    icon: '',
  }
}
