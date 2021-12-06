import React, { useMemo } from 'react';
import { textStyle, GU, IconCheck, useTheme, IconCross, TransactionBadge } from '@1hive/1hive-ui';
import { StepTypes } from '@components/Stepper/stepper-statuses';
import { getNetwork } from '../../../networks';
import { TransactionStatusType } from '../../../constants';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

type DeploymentStepsItemProps = {
  index: number;
  name: string;
  status: TransactionStatusType;
  txHash;
};

function DeploymentStepsItem({ index, name, status, txHash }: DeploymentStepsItemProps) {
  const theme = useTheme();
  const network = getNetwork();

  const { icon, label, styles } = useMemo(() => {
    if (status === StepTypes.STEP_PROMPTING) {
      return {
        label: 'Waiting for signature',
        styles: `
      border: 2px solid ${theme.selected.toString()};
    `,
      };
    }
    if (status === StepTypes.STEP_WORKING) {
      return {
        label: 'Transaction being processed…',
        styles: `background: ${theme.accent.toString()};`,
      };
    }
    if (status === StepTypes.STEP_SUCCESS) {
      return {
        icon: <IconCheck />,
        label: 'Transaction processed!',
        styles: `
        background: ${theme.positive.toString()};
        color: white;
      `,
      };
    }

    if (status === StepTypes.STEP_ERROR) {
      return {
        icon: <IconCross />,
        label: 'An error has occured',
        styles: `
      border: 2px solid ${theme.negative.toString()};
      color: ${theme.negative.toString()};
    `,
      };
    }
    return {
      icon: <span> {index + 1}</span>,
      styles: `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `,
    };
  }, [index, status, theme]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 60px;
        margin-top: ${3 * GU}px;
      `}
    >
      <div
        css={css`
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
        css={css`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${status === StepTypes.STEP_WORKING ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        <div>{name}</div>
        {label && (
          <div
            css={css`
              ${textStyle('body3')};
              color: ${theme.surfaceContentSecondary.toString()};
            `}
          >
            {label}
          </div>
        )}
        {txHash && (
          <TransactionBadge transaction={txHash} networkType={network.type} explorerProvider={network.explorer} />
        )}
      </div>
    </div>
  );
}

export default DeploymentStepsItem;
