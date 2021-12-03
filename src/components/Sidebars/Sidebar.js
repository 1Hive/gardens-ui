import React from 'react'
import { GU, RootPortal } from '@1hive/1hive-ui'
import InnerGardensSidebar from './InnerSidebars/InnerGardensSidebar'

const SIDEBAR_WIDTH = `${9 * GU}px`

const Sidebar = () => {
  return (
    <RootPortal>
      <div
        css={`
          position: absolute;
          height: 100vh;
          z-index: 3;
        `}
      >
        <InnerGardensSidebar applyDelay width={SIDEBAR_WIDTH} />
      </div>
    </RootPortal>
  )
}

export default Sidebar
