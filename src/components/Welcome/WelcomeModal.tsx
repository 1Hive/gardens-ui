/** @jsxImportSource @emotion/react */
import React from "react";
import { Button, GU, Modal, Viewport } from "@1hive/1hive-ui";
import { css, jsx } from "@emotion/react";

const EMBED_ID = "1ZvXNsLEPAg";

const WelcomeModal = React.memo(function WelcomeModal({
  onClose,
  visible,
}: {
  onClose: () => void;
  visible: boolean;
}) {
  return (
    <Viewport>
      {({ width }) => {
        return (
          <Modal
            closeButton={false}
            padding={0}
            width={Math.min(860, width - 40)}
            visible={visible}
          >
            <div
              css={css`
                overflow: hidden;
                padding-bottom: 56.25%;
                position: relative;
                height: 0;
              `}
            >
              <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${EMBED_ID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                css={css`
                  left: 0;
                  top: 0;
                  height: 100%;
                  width: 100%;
                  position: absolute;
                `}
              />
            </div>
            <div
              css={css`
                padding: ${3 * GU}px;
              `}
            >
              <Button label="Close" wide mode="strong" onClick={onClose} />
            </div>
          </Modal>
        );
      }}
    </Viewport>
  );
});

export default WelcomeModal;
