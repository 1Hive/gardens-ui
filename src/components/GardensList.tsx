/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { GU, Pagination, shortenAddress, textStyle, useTheme } from '@1hive/1hive-ui';

import defaultGardenLogo from '@assets/defaultGardenLogo.png';
import defaultTokenLogo from '@assets/defaultTokenLogo.svg';
import EmptyResults from './EmptyResults';
import { css, jsx } from '@emotion/react';

const GARDENS_PER_PAGE = 10;

const computeCurrentGardens = (gardens, currentPage) => {
  const currentGardens = gardens.slice(currentPage * GARDENS_PER_PAGE, GARDENS_PER_PAGE * (currentPage + 1));

  return currentGardens;
};

function GardensList({ gardens }) {
  const [selectedPage, setSelectedPage] = useState(0);

  const pages = Math.ceil(gardens.length / GARDENS_PER_PAGE);

  const currentGardens = useMemo(() => computeCurrentGardens(gardens, selectedPage), [gardens, selectedPage]);

  const handlePageChange = useCallback(page => {
    setSelectedPage(page);
  }, []);

  useEffect(() => {
    if (gardens.length) {
      setSelectedPage(0);
    }
  }, [gardens]);

  return (
    <div>
      {currentGardens.length ? (
        <div>
          <div
            css={css`
              display: grid;
              grid-gap: ${2 * GU}px;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              margin-bottom: ${2 * GU}px;
            `}
          >
            {currentGardens.map(garden => (
              <GardenCard key={garden.id} garden={garden} />
            ))}
          </div>
          {pages > 1 && <Pagination pages={pages} selected={selectedPage} onChange={handlePageChange} />}
        </div>
      ) : (
        <EmptyResults title="No gardens found" />
      )}
    </div>
  );
}

function GardenCard({ garden }) {
  const theme = useTheme();
  const history = useHistory();
  const handleSelectGarden = useCallback(() => {
    history.push(`/garden/${garden.address}`);
  }, [garden, history]);

  const token = garden.wrappableToken || garden.token;

  return (
    <div
      onClick={handleSelectGarden}
      css={css`
        padding: ${5 * GU}px ${4 * GU}px ${3 * GU}px ${4 * GU}px;
        background: ${theme.surface.toString()};
        border: 1px solid ${theme.border.toString()};
        border-radius: ${2.5 * GU}px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: grid;
        grid-template-rows: 72px 32px 92px auto auto;
        grid-gap: ${2 * GU}px;
        text-align: center;
      `}
    >
      <div
        css={css`
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <img
          css={css`
            border-radius: 100%;
          `}
          src={garden.logo || defaultGardenLogo}
          alt=""
          height="72"
        />
      </div>
      <div
        css={css`
          ${textStyle('title4')};
        `}
      >
        {garden.name || shortenAddress(garden.id)}
      </div>
      <div
        css={css`
          color: ${theme.contentSecondary.toString()};
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        `}
      >
        {garden.description || 'No description'}
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          margin-bottom: ${1 * GU}px;
          ${textStyle('title4')};
          justify-content: center;
          color: ${theme.content.toString()};
        `}
      >
        <img src={token?.logo || defaultTokenLogo} alt="" height="20" width="20" />
        <span
          css={css`
            margin-left: ${0.75 * GU}px;
          `}
        >
          {token?.symbol}
        </span>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: ${theme.contentSecondary.toString()};
        `}
      >
        <div>
          {garden.proposalCount} Proposal{garden.proposalCount === 1 ? '' : 's'}
        </div>
        <div>
          {garden.supporterCount} Member{garden.supporterCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
}

export default GardensList;
