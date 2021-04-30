import React from 'react'
import { Link } from '@1hive/1hive-ui'
import { useGardens } from '../providers/Gardens'

function GardensDashboard() {
  const { gardens } = useGardens()
  return (
    <div>
      {gardens.map((garden, index) => (
        <div key={index}>
          <Link href={`#/garden/${garden.address}`} external={false}>
            {garden.id}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default GardensDashboard
