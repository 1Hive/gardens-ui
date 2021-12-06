/** @jsx jsx */
import React from 'react';
import { GU, IconConnect, RADIUS, textStyle, useTheme } from '@1hive/1hive-ui';
import { css, jsx } from '@emotion/react';
import styled from 'styled-components';

function AccountNotConnected() {
  const theme = useTheme();

  return (
    <Wrapper background={theme.background.toString()}>
      <div
        css={css`
          ${textStyle('body1')};
        `}
      >
        You must enable your account to interact on this proposal
      </div>
      <Connect color={theme.surfaceContentSecondary.toString()}>
        Connect to your Ethereum provider by clicking on the{' '}
        <strong
          css={css`
            display: inline-flex;
            align-items: center;
            position: relative;
            top: 7px;
          `}
        >
          <IconConnect /> Enable account
        </strong>{' '}
        button on the header. You may be temporarily redirected to a new screen.
      </Connect>
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  background;
}>`
  border-radius: ${RADIUS}px;
  background: ${props => props.background};
  padding: ${3.5 * GU}px ${10 * GU}px;
  text-align: centesr;
`;

const Connect = styled.div<{
  color;
}>`
  ${textStyle('body2')};
  color: ${props => props.color};
  margin-top: ${2 * GU}px;
`;

export default AccountNotConnected;
