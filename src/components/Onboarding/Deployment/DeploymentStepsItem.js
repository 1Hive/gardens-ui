import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, IconCheck, useTheme } from '@1hive/1hive-ui'
import {
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '@components/Stepper/stepper-statuses'
import { TransactionStatusType } from '@/prop-types'

function DeploymentStepsItem({ index, name, status }) {
  const theme = useTheme()

  const stepStyles = useMemo(() => {
    if (status === STEP_WORKING) {
      return `
        border: 2px solid ${theme.selected};
      `
    }
    if (status === STEP_SUCCESS) {
      return `
        border: 2px solid ${theme.positive};
        color: ${theme.positive};
      `
    }
    return `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `
  }, [status, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${5 * GU}px;
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
          ${stepStyles};
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        {status === STEP_SUCCESS ? (
          <IconCheck />
        ) : (
          status === STEP_WAITING && index + 1
        )}
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
        {status === STEP_SUCCESS && (
          <div
            css={`
              ${textStyle('body3')};
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Signature successful
          </div>
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
