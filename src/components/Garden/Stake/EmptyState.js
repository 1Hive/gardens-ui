import React from 'react'
import { Card, GU, Header, textStyle } from '@1hive/1hive-ui'
import tokenIcon from './assets/connect-icon.svg'
import LayoutColumns from '../Layout/LayoutColumns'

export default function EmptyState({ icon }) {
  return (
    <>
      <Header primary="Collateral Manager" />
      <LayoutColumns
        primary={
          <Card
            css={`
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-bottom: ${6 * GU}px;
              padding-top: ${6 * GU}px;
            `}
          >
            <img
              src={icon}
              alt=""
              css={`
                max-width: ${22 * GU}px;
                height: auto;
                margin: ${4 * GU}px 0;
              `}
            />
            <span
              css={`
                ${textStyle('title3')};
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
