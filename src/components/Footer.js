import React from 'react'
import { GU, Link as AragonLink, textStyle, useTheme } from '@1hive/1hive-ui'
import styled from 'styled-components'
import Layout from './Layout'
import logoSvg from '../assets/logo.svg'

export default function Footer({ compact }) {
  const theme = useTheme()

  return (
    <footer
      css={`
        flex-shrink: 0;
        width: 100%;
        padding: ${5 * GU}px ${compact ? `${3 * GU}px` : 0};
        background: ${theme.surface};
      `}
    >
      <Layout>
        <div
          css={`
            display: ${compact ? 'block' : 'flex'};
            align-items: flex-start;

            & > div {
              margin-bottom: ${2 * GU}px;

              &:not(:first-child) {
                width: ${25 * GU}px;
              }
            }

            & a {
              color: ${theme.contentSecondary};
            }
          `}
        >
          <div
            css={`
              width: ${40 * GU}px;
            `}
          >
            <img src={logoSvg} height="40" alt="" />
          </div>
          <div>
            <h5
              css={`
                ${textStyle('body1')};
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Community
            </h5>
            <Link href="https://keybase.io/team/1hive" external>
              Keybase
            </Link>
            <Link href="https://github.com/1Hive" external>
              Github
            </Link>
            <Link href="https://twitter.com/1HiveOrg" external>
              Twitter
            </Link>
            <Link href="https://forum.1hive.org/" external>
              Forum
            </Link>
          </div>
          <div>
            <h5
              css={`
                ${textStyle('body1')};
                margin-bottom: ${1.5 * GU}px;
              `}
            >
              Tools
            </h5>
            <Link
              href="https://www.notion.so/1Hive-Community-Handbook-f66d489df85a4011bac681963bfee796"
              external
            >
              Handbook
            </Link>
          </div>
        </div>
      </Layout>
    </footer>
  )
}

// TODO: Move to 1hive-ui
const Link = styled(AragonLink)`
  display: block;
  margin-bottom: ${1.5 * GU}px;
  text-align: left;
  text-decoration: none;
`
