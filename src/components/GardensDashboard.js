import React, { useCallback, useState } from 'react'
import GardensList from './GardensList'
import LandingBanner from './LandingBanner'

function GardensDashboard() {
  const [height, setHeight] = useState(0)

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }, [])

  return (
    <div>
      <LandingBanner ref={measuredRef} />
      <div
        css={`
          margin-top: ${height}px;
        `}
      >
        <GardensList />
      </div>
    </div>
  )
}

export default GardensDashboard
