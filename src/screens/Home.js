import React, { useEffect, useState } from 'react'
import { Link } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'
import { getNetwork } from '../networks'

function Home() {
  const [gardens, setGardens] = useState([])

  useEffect(() => {
    let cancelled = false

    const fetchGardens = async () => {
      try {
        const result = await getGardens({ network: getNetwork().chainId }, {})

        if (!cancelled) {
          setGardens(result)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchGardens()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      {gardens.length > 0 ? (
        gardens.map((garden) => (
          <div>
            <Link href={`#/garden/${garden.id}`} external={false}>
              {garden.id}
            </Link>
          </div>
        ))
      ) : (
        <div>No gardens</div>
      )}
    </div>
  )
}

export default Home
