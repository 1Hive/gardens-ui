import React from "react";
import PropTypes from "prop-types";
import { Button, GU, IconClose, IconFile, textStyle } from "@1hive/1hive-ui";

import { css, jsx } from "@emotion/react";

const FilePreview = ({ file, label, onCancel }) => {
  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <div>
          <IconFile
            css={css`
              color: grey;
              width: ${4 * GU}px;
              height: ${4 * GU}px;
            `}
          />
        </div>
        <div
          title={file.name}
          css={css`
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            ${textStyle("body2")};
            margin-right: ${0.5 * GU}px;
          `}
        >
          {file.name || "Unnamed file"}
        </div>
        <div
          css={css`
            margin-left: ${1 * GU}px;
          `}
        >
          <Button
            onClick={handleCancel}
            css={css`
              border-radius: 50%;
            `}
            display="icon"
            label="Remove"
            icon={<IconClose />}
            size="mini"
          />
        </div>
      </div>
      {label}
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({ name: PropTypes.string }),
  label: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
};

export default FilePreview;
