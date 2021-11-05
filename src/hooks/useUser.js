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
      setLoading(true)
      try {
        const user = await getUser(
          { network: getNetwork().chainId },
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
  }, [address, mounted])

  return [user, loading]
}
