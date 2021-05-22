import React, { useMemo } from 'react'
import { Box, useLayout, useTheme, GU } from '@1hive/1hive-ui'

function LayoutBox({ children, heading, primary, mode, ...props }) {
  const { layoutName } = useLayout()
  const theme = useTheme()
  const compactMode = layoutName === 'small'

  const { backgroundColor, borderColor } = useMemo(() => {
    const attributes = {
      warning: {
        backgroundColor: '#fefdfb',
        borderColor: theme.warning,
      },
      negative: {
        backgroundColor: '#FFFAFA',
        borderColor: '#FF7C7C',
      },
      disabled: {
        backgroundColor: theme.surfacePressed,
        borderColor: theme.border,
      },
    }

    return attributes[mode] || {}
  }, [theme, mode])

  const primaryHeading = (
    <span
      css={`
        padding: 0 ${2 * GU}px;
      `}
    >
      {heading}
    </span>
  )

  return (
    <Box
      {...props}
      heading={heading && primary ? primaryHeading : heading}
      padding={compactMode ? 2 * GU : primary && 5 * GU}
      css={`
        ${backgroundColor ? `background-color: ${backgroundColor};` : ''}
        ${borderColor ? `border-color: ${borderColor};` : ''}
      `}
    >
      {children}
    </Box>
  )
}

export default LayoutBox
