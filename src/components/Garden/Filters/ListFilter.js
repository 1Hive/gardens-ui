/** @jsx jsx */
import React, { useCallback } from 'react';
import { GU, useTheme } from '@1hive/1hive-ui';
import HelpTip from '@components/HelpTip';
import { css, jsx } from '@emotion/react';

function ListFilter({ items, selected, onChange }) {
  return (
    <div>
      {items.map((item, index) => (
        <ListItem
          key={index}
          index={index}
          item={item}
          onSelect={onChange}
          selected={selected}
          helptip={item.toLowerCase()}
        />
      ))}
    </div>
  );
}

function ListItem({ index, item, onSelect, selected, helptip }) {
  const theme = useTheme();

  const handleOnClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div
      css={css`
        margin-bottom: ${1 * GU}px;
        color: ${theme[selected === index ? 'content' : 'contentSecondary'].toString()};
      `}
    >
      <span
        css={css`
          cursor: pointer;
        `}
        onClick={handleOnClick}
      >
        {item}
      </span>
      <span
        css={css`
          margin-left: ${1 * GU}px;
          display: inline-block;
        `}
      >
        <HelpTip type={helptip} />
      </span>
    </div>
  );
}

export default ListFilter;
