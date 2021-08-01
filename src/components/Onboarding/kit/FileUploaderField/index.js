import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import {
  Card,
  Field,
  GU,
  IconUpload,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { mimeToExtension, readFile, toOxford } from '@utils/kit-utils'
import FilePreview from './FilePreview'

const DEFAULT_MAX_FILE_SIZE = 1000000 // 1Mb
const DEFAULT_DROPZONE_ID = 'file-uploader'

const getDropzoneColor = (theme, isReject, isAccept) => {
  if (isReject) {
    return { mainColor: theme.negative, backgroundColor: theme.negativeSurface }
  } else if (isAccept) {
    return { mainColor: theme.positive, backgroundColor: theme.positiveSurface }
  } else return { mainColor: '#A1A9A4', backgroundColor: '#FFFFFF' }
}

export const TextFileUploader = ({
  dropzoneId = DEFAULT_DROPZONE_ID,
  label = 'browse your files',
}) => {
  const theme = useTheme()

  return (
    <label
      css={`
        cursor: pointer;
        color: ${theme.link};
      `}
      htmlFor={dropzoneId}
    >
      {label}
    </label>
  )
}

export const FileUploaderField = ({
  allowedMIMETypes,
  file,
  description,
  id = DEFAULT_DROPZONE_ID,
  label,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  onFileUpdated = () => {},
  previewLabel,
  required = false,
}) => {
  const theme = useTheme()
  const iconSize = 7 * GU
  const validExtensions = allowedMIMETypes?.map(f =>
    mimeToExtension(f).toUpperCase()
  )
  const onDrop = useCallback(
    files => {
      const reader = new FileReader()
      const file = files[0]

      if (file?.size <= maxFileSize) {
        if (reader !== undefined && file !== undefined) {
          reader.onload = ({ target: { result } }) => {
            onFileUpdated({
              name: file.name,
              content: result,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            })
          }
          readFile(reader, file)
        }
      }
    },
    [maxFileSize, onFileUpdated]
  )
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: allowedMIMETypes,
    onDrop,
    multiple: false,
  })
  const { mainColor, backgroundColor } = getDropzoneColor(
    theme,
    isDragReject,
    isDragAccept
  )

  return (
    <div
      css={`
        width: 100%;
        color: ${theme.contentSecondary};
        ${textStyle('body2')};
      `}
    >
      <Field label={label} required={required}>
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          {description || (
            <div>
              Drag and drop a file here or <TextFileUploader />.
            </div>
          )}
        </div>
      </Field>
      {/* Set dropzone here due to some problems with the field component and the onclick event bubbling. */}
      <Card
        width="100%"
        height="135px"
        css={`
          border-style: dashed;
          background-color: ${backgroundColor};
          border-color: ${mainColor};
          margin-top: ${-1 * GU}px;
          margin-bottom: ${3 * GU}px;
          transition: background-color 0.5s;
        `}
      >
        <div
          {...getRootProps({ onClick: e => e.stopPropagation() })}
          css={`
            height: 100%;
            width: 100%;
            padding: ${1 * GU}px;
          `}
        >
          <div
            css={`
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              transition-timing-function: ease-in;
              border: 0px solid #d0d0d0;
            `}
          >
            <input
              {...getInputProps({
                id,
                /* Include file extensions as well due to some MIME
                 types aren't working on input tag, e.g., text/markdown. */
                accept: allowedMIMETypes
                  ? [...allowedMIMETypes, ...validExtensions]
                  : null,
              })}
            />
            {!file ? (
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  transition: background-color 0.5s;
                `}
              >
                <div
                  css={`
                    border-radius: 50%;
                    background-color: ${mainColor};
                    cursor: pointer;
                    width: ${iconSize}px;
                    height: ${iconSize}px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  `}
                  onClick={open}
                >
                  <IconUpload
                    css={`
                      color: white;
                      width: ${iconSize - 3 * GU}px;
                      height: ${iconSize - 3 * GU}px;
                    `}
                  />
                </div>
                {validExtensions && (
                  <div
                    css={`
                      margin-top: ${1 * GU}px;
                      color: ${mainColor};
                      font-weight: bold;
                    `}
                  >
                    Valid file format: {toOxford(validExtensions)}
                  </div>
                )}
              </div>
            ) : (
              <FilePreview
                file={file}
                onCancel={() => onFileUpdated(null)}
                label={previewLabel}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

TextFileUploader.propTypes = {
  dropzoneId: PropTypes.string,
  label: PropTypes.string,
}

FileUploaderField.propTypes = {
  file: PropTypes.object,
  onFileUpdated: PropTypes.func,
  description: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node,
  maxFileSize: PropTypes.number,
  previewLabel: PropTypes.node,
  require: PropTypes.bool,
  allowedMIMETypes: PropTypes.arrayOf(PropTypes.string),
}
