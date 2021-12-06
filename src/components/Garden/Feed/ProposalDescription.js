import React from 'react';
import { GU, LoadingRing, textStyle } from '@1hive/1hive-ui';
import Description from '../Description';

import { useDescribeVote } from '@hooks/useDescribeVote';
import { ProposalTypes } from '@/types';

/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function ProposalDescription({ proposal, onSelectProposal }) {
  return (
    <div
      onClick={onSelectProposal}
      css={css`
        cursor: pointer;
        margin-bottom: ${3 * GU}px;
        ${textStyle('body1')};
        text-decoration: underline;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      `}
    >
      {proposal.type === ProposalTypes.Decision ? <DecisionDescription proposal={proposal} /> : proposal.name}
    </div>
  );
}

function DecisionDescription({ proposal }) {
  const { description, emptyScript, loading } = useDescribeVote(proposal.script, proposal.id);

  if (loading) {
    return <LoadingRing />;
  }

  return (
    <div>
      {emptyScript ? (
        proposal.metadata || 'No description'
      ) : (
        <Description
          path={description}
          css={css`
            -webkit-line-clamp: 2;
            overflow: hidden;
            max-width: 750px;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          `}
        />
      )}
    </div>
  );
}

export default ProposalDescription;
