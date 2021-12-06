import React from 'react';
import { Field, GU } from '@1hive/1hive-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function InfoField({ label, children, ...props }) {
  return (
    <Field
      label={label}
      {...props}
      css={css`
        margin-bottom: 0;
      `}
    >
      {/* Pass unused id to disable clickable label  */}
      {({ id }) => (
        <div
          css={css`
            padding-top: ${0.5 * GU}px;
          `}
        >
          {children}
        </div>
      )}
    </Field>
  );
}

export default InfoField;
