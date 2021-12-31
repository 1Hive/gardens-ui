import { useCallback, useEffect, useState } from 'react'
import { getUser } from '@1hive/connect-gardens'
import { useMounted } from './useMounted'
import { getNetwork } from '../networks'
import { transformUserData } from '@utils/data-utils'
import { useWallet } from '@/providers/Wallet'
import { UserData } from '@1hive/connect-gardens/dist/cjs/types'

export default function useUser(address: string) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refetchTriger, setRefetchTriger] = useState(false)
  const mounted = useMounted()
  const { preferredNetwork } = useWallet()

  const { subgraphs } = getNetwork(preferredNetwork)

  const reload = useCallback(() => {
    setRefetchTriger(!refetchTriger)
  }, [])

  useEffect(() => {
    if (!address && user) {
      setUser(null)
    }
  }, [address, user])

  useEffect(() => {
    if (!address) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      setLoading(true)
      try {
        const user = await getUser(
          { network: preferredNetwork, subgraphUrl: subgraphs.gardens },
          { id: address.toLowerCase() }
        )
        if (mounted()) {
          setUser(transformUserData(user))
        }
      } catch (err) {
        setUser(null)
        console.error(`Failed to fetch user: ${err}`)
      }
      setLoading(false)
    }
    fetchUser()
  }, [address, mounted, preferredNetwork, refetchTriger, subgraphs.gardens])

  return { user, loading, reload }
}
