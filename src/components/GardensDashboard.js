import React from 'react'
import { GU, Link } from '@1hive/1hive-ui'
import { useGardens } from '../providers/Gardens'

function GardensDashboard() {
  const { gardens } = useGardens()
  return (
    <div
      css={`
        padding: ${3 * GU}px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      `}
    >
      {gardens.map((garden, index) => (
        <div key={index}>
          <Link href={`#/garden/${garden.address}`} external={false}>
            {garden.id}
          </Link>
          <span>{garden.proposalCount}</span>
        </div>
      ))}
    </div>
  )
}

export default GardensDashboard
