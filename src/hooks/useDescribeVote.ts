import { useEffect, useState, useMemo } from 'react'
import { getAppPresentationByAddress } from '@utils/app-utils'
import { addressesEqual } from '@utils/web3-utils'
import { useMounted } from '@hooks/useMounted'
import { useGardenState } from '@providers/GardenState'
import { AppType } from './constants'

type Description = {
  annotatedDescription: Array<{
    type: string
    value: string
  }>
  children: any
  data: string
  description: string
  to: string
  name: string
  identifier: any
}

const cachedDescriptions = new Map<number, any>([])

export function useDescribeVote(script: string, voteId: number) {
  const mounted = useMounted()

  const { installedApps, organization } = useGardenState()

  const [description, setDescription] = useState<Array<Description> | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  const emptyScript = script === '0x00000001' || script === '0x00'

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

          // Cache vote description to avoid unnecessary future call
          cachedDescriptions.set(voteId, describedSteps)
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }

    describe()
  }, [emptyScript, script, voteId, organization, mounted])

  return { description, emptyScript, loading, targetApp }
}

function targetDataFromTransactionRequest(
  apps: Array<AppType>,
  transactionRequest: Description
) {
  const { to: targetAppAddress, name, identifier } = transactionRequest

  // Populate details via our apps list if it's available
  if (apps.some(({ address }) => addressesEqual(address, targetAppAddress))) {
    const appPresentation = getAppPresentationByAddress(apps, targetAppAddress)

    return {
      address: targetAppAddress,
      name: appPresentation !== null ? appPresentation.humanName : '',
      icon: appPresentation !== null ? appPresentation.iconSrc : '',
    }
  }

  // Otherwise provide some fallback values
  return {
    address: targetAppAddress,
    name: name || identifier,
    icon: '',
  }
}
