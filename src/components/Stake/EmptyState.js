import React from 'react'
import { Card, GU, Header, textStyle, useLayout } from '@1hive/1hive-ui'
import tokenIcon from './assets/connect-icon.svg'
import LayoutColumns from '../Layout/LayoutColumns'

export default function EmptyState({ icon }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <>
      <Header primary="Stake Management" />
      <LayoutColumns
        primary={
          <Card
            css={`
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <img
              src={icon}
              alt=""
              css={`
                width: 100%;
                max-width: ${(compactMode ? 21 : 30) * GU}px;
                height: auto;
                margin: ${4 * GU}px 0;
              `}
            />
            <span
              css={`
                font-weight: 300;
                ${textStyle('body1')};
                margin-bottom: ${GU}px;
              `}
            >
              No data available
            </span>
          </Card>
        }
        secondary={
          <>
            <Card
              css={`
                width: 100%;
                height: auto;
                text-align: center;
                padding: ${3 * GU}px;
              `}
            >
              <img
                src={tokenIcon}
                width={6.5 * GU}
                height={6.5 * GU}
                css={`
                  margin: auto;
                  margin-bottom: ${1 * GU}px;
                `}
              />
              <span
                css={`
                  font-weight: 300;
                  ${textStyle('body2')};
                `}
              >
                To check your balances please connect your account
              </span>
            </Card>
          </>
        }
        inverted
      />
    </>
  )
}
