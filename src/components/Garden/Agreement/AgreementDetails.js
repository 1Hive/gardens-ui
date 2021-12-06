/** @jsx jsx */
import React from 'react';
import { textStyle, IdentityBadge, Link, IconCheck, useLayout, GU, RADIUS, useTheme } from '@1hive/1hive-ui';
import { dateFormat } from '@utils/date-utils';
import InfoField from '../InfoField';
import { getIpfsCidFromUri, getIpfsUrlFromUri } from '@utils/ipfs-utils';
import { getNetwork } from '@/networks';
import { css, jsx } from '@emotion/react';

function AgreementDetails({ creationDate, contractAddress, ipfsUri, stakingAddress, signedAgreement }) {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const mobileMode = layoutName === 'small';
  const multiColumnsMode = layoutName === 'max' || layoutName === 'medium';

  const celesteUrl = getNetwork().celesteUrl;

  const ipfsCID = getIpfsCidFromUri(ipfsUri);

  return (
    <>
      <div
        css={css`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <InfoField label="Covenant IPFS Link">
          <Link
            href={getIpfsUrlFromUri(ipfsUri)}
            style={{
              maxWidth: '90%',
            }}
          >
            <span
              css={css`
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
              `}
            >
              {mobileMode ? `${ipfsCID.slice(0, 4)}...${ipfsCID.slice(-4)}` : ipfsCID}
            </span>
          </Link>
        </InfoField>
      </div>
      <div
        css={css`
          display: grid;
          grid-gap: ${multiColumnsMode ? 2 * GU : 3 * GU}px;
          grid-auto-flow: ${multiColumnsMode ? 'column' : 'row'};
        `}
      >
        <InfoField label="Arbitrator">
          <Link href={celesteUrl}>Celeste</Link>
        </InfoField>
        <InfoField label="Staking Pool">
          <IdentityBadge entity={stakingAddress} />
        </InfoField>
        <InfoField label="Covenant Contract">
          <IdentityBadge entity={contractAddress} />
        </InfoField>
        <InfoField label="Creation Date">{dateFormat(creationDate)}</InfoField>
      </div>

      {signedAgreement && (
        <div
          css={css`
            display: flex;
            justify-content: center;
            margin-top: ${5 * GU}px;
            background-color: ${theme.background.toString()};
            border: 1px solid ${theme.border.toString()};
            padding: ${4 * GU}px;
            border-radius: ${RADIUS}px;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 100%;
                color: ${theme.accent.toString()};
                border: 2px solid currentColor;
                width: ${5.5 * GU}px;
                height: ${5.5 * GU}px;
                margin-right: ${2 * GU}px;
                flex-shrink: 0;
              `}
            >
              <IconCheck />
            </div>
            <div>
              <h2
                css={css`
                  ${textStyle('body1')}
                  font-weight: 600;
                `}
              >
                You have sucessfully signed this Covenant
              </h2>
              <p
                css={css`
                  color: ${theme.surfaceContentSecondary.toString()};
                `}
              >
                You can now manage your token balances using the Deposit Manager.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AgreementDetails;
