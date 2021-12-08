import React, { useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button, IconArrowLeft, GU, useTheme } from "@1hive/1hive-ui";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

const Navigation = React.forwardRef(function Navigation(
  { backEnabled, backLabel, nextEnabled, nextLabel, onBack, onNext },
  ref
) {
  const theme = useTheme();

  const nextRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      focusNext: () => {
        if (nextRef.current) {
          nextRef.current.focus();
        }
      },
    }),
    []
  );

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <Button
        disabled={!backEnabled}
        icon={
          <IconArrowLeft
            css={css`
              color: ${theme.accent.toString()};
            `}
          />
        }
        label={backLabel}
        onClick={onBack}
      />
      <Button
        ref={nextRef}
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
        type="submit"
        css={css`
          margin-left: ${1.5 * GU}px;
        `}
      />
    </div>
  );
});

Navigation.propTypes = {
  backEnabled: PropTypes.bool.isRequired,
  backLabel: PropTypes.string.isRequired,
  nextEnabled: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  backEnabled: true,
  backLabel: "Back",
  nextEnabled: true,
  nextLabel: "Next",
};

export default Navigation;
