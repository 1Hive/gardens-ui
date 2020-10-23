import React from 'react'
import { Box, GU, textStyle, useTheme, useLayout } from '@1hive/1hive-ui'
import beeIconSvg from '../../assets/bee.svg'

export default function EmptyResults({ title, paragraph }) {
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
          src={beeIconSvg}
          alt=""
          css={`
            display: block;
            width: 100px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />
        <span
          css={`
            ${textStyle(compactMode ? 'title4' : 'title2')};
            text-align: center;
          `}
        >
          {title}
        </span>
        <div
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
            width: ${(compactMode ? 25 : 55) * GU}px;
            display: flex;
            text-align: center;
          `}
        >
          {paragraph}
        </div>
      </div>
    </Box>
  )
}
