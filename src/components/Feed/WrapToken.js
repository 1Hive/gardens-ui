import React from 'react'
import styled from 'styled-components'
import { Box, GU, useLayout, useTheme } from '@1hive/1hive-ui'

import { useGardens } from '../../providers/Gardens'

// import wrappedIcon from '../../assets/wrappedIcon.svg'
// import unwrappedIcon from '../../assets/unwrappedIcon.svg'

function WrapToken() {
  const { layoutName } = useLayout()
  const { connectedGarden } = useGardens()
  console.log('connected garden ', connectedGarden)
  const theme = useTheme()
  const compactMode = layoutName === 'small' || layoutName === 'medium'
  console.log('compact ', compactMode)
  return (
    <Box padding={3 * GU}>
      <div
        css={`
          display: flex;
          flex-direction: row;
          height: ${27 * GU}px;
        `}
      >
        <div>HELLOOOOOOO</div>
        <LineSeparator border={theme.border} />
        <div> HELLOOOOOOO </div>
      </div>
    </Box>
  )
}

// function Token({ mode }) {

// }

const LineSeparator = styled.div`
  border-left: 1px solid ${({ border }) => border};
  margin: 0 ${3 * GU}px;
`

export default WrapToken
