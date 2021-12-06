import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { GU, Link } from '@1hive/1hive-ui';
import AgreementStatus from '../Common/AgreementStatus';
import CollateralStatus from '../Common/CollateralStatus';
import ModalButton from '../ModalButton';
import InfoField from '../../InfoField';
import { useMultiModal } from '@components/MultiModal/MultiModalProvider';

import { buildGardenPath } from '@utils/routing-utils';
import { dateFormat } from '@utils/date-utils';
import env from '@/environment';
import { formatTokenAmount } from '@utils/token-utils';
import { getDisputableAppByName } from '@utils/app-utils';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function CreateProposalRequirements({ agreement, staking }) {
  const history = useHistory();
  const { next } = useMultiModal();

  const { disputableAppsWithRequirements, signedLatest } = agreement;
  const { available: availableStaked, allowance } = staking || {};

  const convictionAppRequirements = getDisputableAppByName(disputableAppsWithRequirements, env('CONVICTION_APP_NAME'));
  const { token, actionAmount } = convictionAppRequirements;
  const enoughCollateral = availableStaked.gte(actionAmount);
  const enoughAllowance = allowance.gt(0);

  const error = useMemo(() => {
    return !signedLatest || !enoughCollateral || !enoughAllowance;
  }, [enoughAllowance, enoughCollateral, signedLatest]);

  const handleOnContinue = useCallback(() => {
    next();
  }, [next]);

  return (
    <div>
      <InfoField label="Covenant signature and version">
        Since proposals are bound by this community's covenant, you must sign the{' '}
        <Link href={`#${buildGardenPath(history.location, 'covenant')}`} external={false}>
          Covenant
        </Link>{' '}
        in order to create a proposal. The Covenant was last updated on {dateFormat(agreement.effectiveFrom)}
      </InfoField>
      <AgreementStatus agreement={agreement} />
      <InfoField
        label="Proposal deposit"
        css={css`
          margin-top: ${5 * GU}px;
        `}
      >
        In order to discourage spam proposals, you are required to deposit{' '}
        {formatTokenAmount(actionAmount, token.decimals)} {token.symbol} for each proposal you create. You can manage
        your balance using the{' '}
        <Link href={`#${buildGardenPath(history.location, 'collateral')}`} external={false}>
          Deposit Manager
        </Link>
      </InfoField>
      <CollateralStatus
        allowance={allowance}
        availableStaked={availableStaked}
        actionAmount={actionAmount}
        token={token}
      />
      <ModalButton mode="strong" loading={false} onClick={handleOnContinue} disabled={error}>
        Continue
      </ModalButton>
    </div>
  );
}

export default CreateProposalRequirements;
