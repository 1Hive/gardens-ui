import React from 'react'
import PropTypes from 'prop-types'
import {
  textStyle,
  GU,
  Link,
  useTheme,
  ProgressBar,
  Info,
} from '@1hive/1hive-ui'
import DeploymentStepsItem from './DeploymentStepsItem'
import { TransactionStatusType } from '@/prop-types'

function DeploymentStepsPanel({ transactionsStatus, pending, allSuccess }) {
  const theme = useTheme()

  return (
    <aside
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: ${5 * GU}px ${3 * GU}px ${2 * GU}px;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
      `}
    >
      <ProgressBar
        value={Math.max(
          0,
          Math.min(1, allSuccess ? 1 : pending / transactionsStatus.length)
        )}
      />
      <div
        css={`
          padding: ${3 * GU}px 0 ${3 * GU}px;
          ${textStyle('body1')};
          text-align: center;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        Launching your Garden
      </div>

      <div
        css={`
          flex-grow: 1;
          padding: ${5 * GU}px 0px;
        `}
      >
        <h1
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Signature process
        </h1>

        <div>
          {transactionsStatus.map(({ name, status, txHash }, index) => (
            <DeploymentStepsItem
              key={index}
              index={index}
              name={name}
              status={status}
              txHash={txHash}
            />
          ))}
        </div>
      </div>

      {!allSuccess && (
        <Info mode="warning">
          It might take some time before these transactions get processed.
          Please be patient and do not close this window until it finishes.
        </Info>
      )}
    </aside>
  )
}

DeploymentStepsPanel.propTypes = {
  allSuccess: PropTypes.bool.isRequired,
  pending: PropTypes.number.isRequired,
  transactionsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: TransactionStatusType.isRequired,
    })
  ).isRequired,
}

const InlineLink = ({ href, children }) => (
  <Link href={href} css="display: inline; white-space: normal">
    {children}
  </Link>
)

InlineLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default DeploymentStepsPanel
