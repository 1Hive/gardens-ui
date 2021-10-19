import { useEffect, useState } from 'react'
import { getUser } from '@1hive/connect-gardens'
import { useMounted } from './useMounted'
import { getNetwork } from '../networks'
import { transformUserData } from '@utils/data-utils'

export default function useUser(address) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState()
  const mounted = useMounted()

  useEffect(() => {
    if (!address && user) {
      setUser(null)
    }
  }, [address, user])

  useEffect(() => {
    if (!address) {
      return
    }

    const fetchUser = async () => {
      try {
        setLoading(true)
        const user = await getUser(
          { network: getNetwork().chainId },
          { id: address.toLowerCase() }
        )
        setLoading(false)
        if (mounted()) {
          setUser(transformUserData(user))
        }
      } catch (err) {
        setLoading(false)
        setUser(null)
        console.error(`Failed to fetch user: ${err}`)
      }
    }
    fetchUser()
  }, [address, mounted])

  return [user, loading]
}
