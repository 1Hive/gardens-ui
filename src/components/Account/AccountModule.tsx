/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, GU, IconConnect } from '@1hive/1hive-ui';
import { useWallet } from '@providers/Wallet';

import ScreenError from './ScreenError';
import AccountButton from './AccountButton';
import ScreenProviders from './ScreenProviders';
import ScreenConnected from './ScreenConnected';
import ScreenConnecting from './ScreenConnecting';
import ScreenPromptingAction from './ScreenPromptingAction';
import HeaderPopover from '../Header/HeaderPopover';
import { useProfile } from '../../providers/Profile';
import { css, jsx } from '@emotion/react';

const SCREENS = [
  {
    id: 'providers',
    title: null,
  },
  {
    id: 'connecting',
    title: null,
  },
  {
    id: 'networks',
    title: null,
  },
  {
    id: 'connected',
    title: null,
  },
  {
    id: 'error',
    title: null,
  },
];

function AccountModule({ compact }) {
  const buttonRef = useRef();

  const { account, activating, connect, connector, error, resetConnection, switchingNetworks } = useWallet();
  const [opened, setOpened] = useState(false);
  const [activatingDelayed, setActivatingDelayed] = useState(false);

  const { boxOpened } = useProfile();

  const toggle = useCallback(() => setOpened(opened => !opened), []);

  const activate = useCallback(
    async providerId => {
      try {
        await connect(providerId);
      } catch (error) {
        console.log('error ', error);
      }
    },
    [connect],
  );

  useEffect(() => {
    if (account && boxOpened) {
      setOpened(false);
    }
  }, [account, boxOpened]);

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (error) {
      setActivatingDelayed(null);
    }

    if (activating) {
      setActivatingDelayed(activating);
      return;
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [activating, error]);

  const previousScreenIndex = useRef(-1);

  const { direction, screenIndex } = useMemo(() => {
    const screenId = (() => {
      if (error) return 'error';
      if (activatingDelayed) return 'connecting';
      if (switchingNetworks) return 'networks';
      if (account) return 'connected';
      return 'providers';
    })();

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId);
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1;

    previousScreenIndex.current = screenIndex;

    return { direction, screenIndex };
  }, [activatingDelayed, account, error, switchingNetworks]);

  const screen = SCREENS[screenIndex];
  const screenId = screen.id;

  const handlePopoverClose = useCallback(
    reject => {
      if (screenId === 'connecting' || screenId === 'error') {
        // reject closing the popover
        return false;
      }
      setOpened(false);
    },
    [screenId],
  );

  return (
    <div
      ref={buttonRef}
      tabIndex={0}
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-around;
        outline: 0;
      `}
    >
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button icon={<IconConnect />} label="Enable account" onClick={toggle} display={compact ? 'icon' : 'all'} />
      )}
      <HeaderPopover
        direction={direction}
        heading={screen.title}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          screenId,
        }}
        screenKey={({ account, activating, activationError, screenId }) =>
          (activationError ? activationError.name : '') + account + activating + screenId
        }
        visible={opened}
        width={(screen.id === 'connected' ? 41 : 51) * GU}
      >
        {({ activating, activationError, screenId }) => {
          if (screenId === 'connecting') {
            return <ScreenConnecting providerId={connector} onCancel={resetConnection} />;
          }
          if (screenId === 'connected') {
            return <ScreenConnected providerId={connector} onClosePopover={handlePopoverClose} />;
          }
          if (screenId === 'error') {
            return <ScreenError error={activationError} onBack={resetConnection} />;
          }
          if (screen.id === 'networks') {
            return <ScreenPromptingAction />;
          }
          return <ScreenProviders onActivate={activate} />;
        }}
      </HeaderPopover>
    </div>
  );
}

export default AccountModule;
