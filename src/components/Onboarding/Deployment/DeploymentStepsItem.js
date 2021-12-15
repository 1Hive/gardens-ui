import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  textStyle,
  GU,
  IconCheck,
  useTheme,
  IconCross,
  TransactionBadge,
} from '@1hive/1hive-ui'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WORKING,
} from '@components/Stepper/stepper-statuses'
import { TransactionStatusType } from '@/prop-types'
import { getNetwork } from '@/networks'
import { useWallet } from 'use-wallet'

function DeploymentStepsItem({ index, name, status, txHash }) {
  const theme = useTheme()
  const { chainId } = useWallet()
  const network = getNetwork(chainId)

  const { icon, label, styles } = useMemo(() => {
    if (status === STEP_PROMPTING) {
      return {
        label: 'Waiting for signature',
        styles: `
      border: 2px solid ${theme.selected};
    `,
      }
    }
    if (status === STEP_WORKING) {
      return {
        label: 'Transaction being processed…',
        styles: `background: ${theme.accent};`,
      }
    }
    if (status === STEP_SUCCESS) {
      return {
        icon: <IconCheck />,
        label: 'Transaction processed!',
        styles: `
        background: ${theme.positive};
        color: white;
      `,
      }
    }

    if (status === STEP_ERROR) {
      return {
        icon: <IconCross />,
        label: 'An error has occured',
        styles: `
      border: 2px solid ${theme.negative};
      color: ${theme.negative};
    `,
      }
    }
    return {
      icon: <span> {index + 1}</span>,
      styles: `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `,
    }
  }, [index, status, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: 60px;
        margin-top: ${3 * GU}px;
      `}
    >
      <div
        css={`
          width: ${5 * GU}px;
          height: ${5 * GU}px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          font-weight: 600;
          flex-shrink: 0;
          flex-grow: 0;
          ${styles};
        `}
      >
        {icon || null}
      </div>
      <div
        css={`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${status === STEP_WORKING ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        <div>{name}</div>
        {label && (
          <div
            css={`
              ${textStyle('body3')};
              color: ${theme.surfaceContentSecondary};
            `}
          >
            {label}
          </div>
        )}
        {txHash && (
          <TransactionBadge
            transaction={txHash}
            networkType={network.type}
            explorerProvider={network.explorer}
          />
        )}
      </div>
    </div>
  )
}

DeploymentStepsItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: TransactionStatusType.isRequired,
}

export default DeploymentStepsItem
