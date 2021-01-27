import React from 'react'
import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'

export default function EmptyState({ icon, title, paragraph }) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <Box>
      <div
        css={`
          margin: ${(compactMode ? 0 : 9) * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={icon}
          alt=""
          css={`
            display: block;
            width: 100%;
            max-width: ${(compactMode ? 21 : 30) * GU}px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />

        <h1
          css={`
            ${textStyle(compactMode ? 'title4' : 'title2')};
            text-align: center;
          `}
        >
          {title}
        </h1>
        <p
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
            width: ${(compactMode ? 35 : 55) * GU}px;
            display: flex;
            text-align: center;
          `}
        >
          {paragraph}
        </p>
      </div>
    </Box>
  )
}
