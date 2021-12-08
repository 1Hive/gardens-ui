import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  GU,
  IconArrowUp,
  Markdown,
  Modal,
  RootPortal,
  textStyle,
} from "@1hive/1hive-ui";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

const MINIMUM_SCROLL_TOP = 150;

const CovenantModal = ({ open, file, onClose }) => {
  const [displayScrollBtn, setDisplayScrollBtn] = useState(false);
  const modalRef = useRef();

  const handleScrollChange = useCallback(
    (e) => {
      /**
       * Can't get modal ref directly from modal because it doesn't
       * implement ref forwarding so we get it from the event target.
       */
      if (!modalRef.current) {
        modalRef.current = e.target;
      }

      if (e.target.scrollTop > MINIMUM_SCROLL_TOP) {
        setDisplayScrollBtn(true);
      } else {
        setDisplayScrollBtn(false);
      }
    },
    [setDisplayScrollBtn]
  );

  const handleCloseModal = useCallback(
    (e) => {
      /**
       * Hide modal only when clicking the close button to
       * avoid closing it when clicking the "back to top" button
       */
      if (e && e.target) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) {
      modalRef.current = null;
    }
  }, [open]);

  return (
    <Modal
      css={css`
        z-index: 4;
      `}
      visible={open}
      onClose={handleCloseModal}
      onScroll={handleScrollChange}
      width="960px"
    >
      <div
        css={css`
          padding: 0 ${4 * GU}px;
          padding-top: ${2 * GU}px;
        `}
      >
        <Markdown normalized content={file?.content ?? ""} />
        <RootPortal>
          <div
            css={css`
              opacity: ${displayScrollBtn ? "1" : "0"};
              position: fixed;
              bottom: ${2 * GU}px;
              right: ${4 * GU}px;
              z-index: 5;
              transition: opacity 0.5s;
            `}
          >
            <Button
              css={css`
                padding: ${1 * GU};
                ${textStyle("body3")};
              `}
              size="small"
              onClick={() =>
                modalRef.current.scrollTo({ behavior: "smooth", top: 0 })
              }
            >
              <IconArrowUp /> Back to Top
            </Button>
          </div>
        </RootPortal>
      </div>
    </Modal>
  );
};

export default CovenantModal;
