import React from 'react';
import { textStyle, GU, Link, useTheme, ProgressBar, Info } from '@1hive/1hive-ui';
import DeploymentStepsItem from './DeploymentStepsItem';
import { TransactionStatusType } from '../../../constants';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

type DeploymentStepsPanelProps = {
  allSuccess: boolean;
  pending: number;
  transactionsStatus: [
    {
      name: string;
      status: TransactionStatusType;
      txHash?: any;
    },
  ];
};

function DeploymentStepsPanel({ transactionsStatus, pending, allSuccess }: DeploymentStepsPanelProps) {
  const theme = useTheme();

  return (
    <aside
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: ${5 * GU}px ${3 * GU}px ${2 * GU}px;
        background: ${theme.surface.toString()};
        border-right: 1px solid ${theme.border.toString()};
      `}
    >
      <ProgressBar value={Math.max(0, Math.min(1, allSuccess ? 1 : pending / transactionsStatus.length))} />
      <div
        css={css`
          padding: ${3 * GU}px 0 ${3 * GU}px;
          ${textStyle('body1')};
          text-align: center;
          color: ${theme.surfaceContentSecondary.toString()};
        `}
      >
        Launching your Garden
      </div>

      <div
        css={css`
          flex-grow: 1;
          padding: ${5 * GU}px 0px;
        `}
      >
        <h1
          css={css`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary.toString()};
          `}
        >
          Signature process
        </h1>

        <div>
          {transactionsStatus.map(({ name, status, txHash }, index) => (
            <DeploymentStepsItem key={index} index={index} name={name} status={status} txHash={txHash} />
          ))}
        </div>
      </div>

      {!allSuccess && (
        <Info mode="warning">
          It might take some time before these transactions get processed. Please be patient and do not close this
          window until it finishes.
        </Info>
      )}
    </aside>
  );
}

const InlineLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    style={{
      display: 'inline',
      whiteSpace: 'normal',
    }}
  >
    {children}
  </Link>
);

export default DeploymentStepsPanel;
