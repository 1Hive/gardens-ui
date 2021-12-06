import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { GU, Info, Modal, textStyle, useLayout, useTheme, useViewport } from '@1hive/1hive-ui';
import LoadingRing from '../LoadingRing';
import { BRIGHT_ID_APP_DEEPLINK } from '@/endpoints';
import { sponsorUser } from '@/services/sponsorUser';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function BrightIdModal({ account, addressExist, visible, onClose }) {
  const [error, setError] = useState(null);

  const deepLink = `${BRIGHT_ID_APP_DEEPLINK}/${account}`;
  const { width } = useViewport();
  const { layoutName } = useLayout();
  const compactMode = layoutName === 'small';
  const theme = useTheme();

  useEffect(() => {
    if (!addressExist) {
      return;
    }

    let cancelled = false;

    const sponsor = async () => {
      try {
        // If the user exists, means it's not sponsored yet
        const { error } = await sponsorUser(account);

        if (error && !cancelled) {
          setError(`Error sponsoring account: ${error}`);
        }
      } catch (err) {
        setError(true);
        console.error('Error when sponsoring account: ', err);
      }
    };

    sponsor();

    return () => {
      cancelled = true;
    };
  }, [account, addressExist]);

  return (
    <Modal padding={6 * GU} visible={visible} width={Math.min(64 * GU, width - 40)} onClose={onClose}>
      <h5
        css={css`
          ${textStyle('title3')};
          color: ${theme.surfaceContent.toString()};
        `}
      >
        BrightID Verification
      </h5>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: ${6 * GU}px;
          margin-left: ${(compactMode ? 0 : 10) * GU}px;
          margin-right: ${(compactMode ? 0 : 10) * GU}px;
        `}
      >
        <h5
          css={css`
            ${textStyle('body1')};
            color: ${theme.surfaceContent.toString()};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Connect with BrightID
        </h5>
        {addressExist ? (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            `}
          >
            {error ? (
              <Info mode="error">{error}</Info>
            ) : (
              <>
                <div
                  css={css`
                    margin-bottom: ${2 * GU}px;
                  `}
                >
                  <LoadingRing />
                </div>
                <span
                  css={css`
                    ${textStyle('body2')};
                    color: ${theme.contentSecondary.toString()};
                  `}
                >
                  We are in the process of Sponsoring you
                </span>
                <span
                  css={css`
                    ${textStyle('body3')};
                    color: ${theme.contentSecondary.toString()};
                    margin-top: ${3 * GU}px;
                  `}
                >
                  Please do not close this window, otherwise the process will be stopped
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <QRCode value={deepLink} style={{ width: `${17 * GU}px`, height: `${17 * GU}px` }} />
            <Info
              mode="warning"
              css={css`
                margin-top: ${3 * GU}px;
              `}
            >
              Scanning this code will prevent any previously connected addresses from connecting to BrightID in the
              future through any 1Hive apps
            </Info>
          </>
        )}
      </div>
    </Modal>
  );
}

export default BrightIdModal;
