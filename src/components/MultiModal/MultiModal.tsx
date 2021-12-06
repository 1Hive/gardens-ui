import React, { useCallback, useState, useEffect } from 'react';
import { noop } from '@1hive/1hive-ui';
import { Inside } from 'use-inside';

type MultiModal = {
  visible: boolean;
  onClose: () => void;
  onClosed: () => void;
  children: React.ReactNode;
};

function MultiModal({ visible, onClose, onClosed, children }: MultiModal) {
  const [render, setRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setRender(true);
    }
  }, [render, visible]);

  const handleOnClosed = useCallback(() => {
    // Ensure react-spring has properly cleaned up state prior to unmount
    setTimeout(() => {
      onClosed();
      setRender(false);
    });
  }, [setRender, onClosed]);

  return (
    <>
      {render && (
        <Inside name="MultiModal" data={{ onClose, handleOnClosed, visible }}>
          {children}
        </Inside>
      )}
    </>
  );
}

MultiModal.defaultProps = {
  onClose: noop,
  onClosed: noop,
};

export default MultiModal;
