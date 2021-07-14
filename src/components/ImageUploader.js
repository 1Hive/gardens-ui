import React, { useState } from 'react'
import {
  GU,
  IconCheck,
  IconCloudUpload,
  IconClose,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import styled from 'styled-components'

const MAX_FILE_SIZE = 1000000 // 1Mb

function ImageUploader({ id, imageExist, onImageLoaded, onImageRemoved }) {
  const theme = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState('')

  const photoUpload = e => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    if (file?.size <= MAX_FILE_SIZE) {
      if (reader !== undefined && file !== undefined) {
        reader.onloadend = () => {
          setImageLoaded(true)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setError('Max size 1Mb')
    }
  }

  const handleOnChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        handleReaderLoaded(reader, file.type.split('/')[1])
      }
      reader.readAsBinaryString(file)
    }
  }

  const handleReaderLoaded = (reader, extension) => {
    const binaryString = reader.result
    onImageLoaded(btoa(binaryString), extension)
  }

  const handleRemove = e => {
    e.preventDefault()
    setImageLoaded(false)
    document.getElementById(`file-${id}`).value = ''
    onImageRemoved()
  }

  return (
    <div>
      {(imageLoaded || imageExist) && (
        <div
          css={`
            display: flex;
            position: absolute;
            height: ${3 * GU}px;
            width: ${3 * GU}px;
            right: 5px;
            top: 5px;
            bottom: 0;
            border-style: solid;
            border-radius: 50%;
            border-width: 2px;
            align-items: center;
            cursor: pointer;
          `}
          onClick={handleRemove}
        >
          <IconClose size="medium" />
        </div>
      )}
      <form onChange={handleOnChange}>
        <Container
          width={100}
          height={100}
          hoverColor={theme.selected}
          imageLoaded={imageLoaded || imageExist}
          successColor={theme.positive}
        >
          {imageLoaded || imageExist ? (
            <IconCheck
              css={`
                cursor: pointer;
                color: ${theme.positiveContent};
              `}
              size="large"
            />
          ) : (
            <IconCloudUpload
              css={`
                cursor: pointer;
              `}
              size="large"
            />
          )}
          <input
            type="file"
            name="avatar"
            id={`file-${id}`}
            accept=".png, .jpg"
            onChange={photoUpload}
          />
        </Container>
      </form>
      {error && (
        <div
          css={`
            width: 95px;
          `}
        >
          <span
            css={`
              color: ${theme.error};
              ${textStyle('body4')};
            `}
          >
            {error}
          </span>
        </div>
      )}
    </div>
  )
}

const Container = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  background: ${props => (props.imageLoaded ? props.successColor : '#eceff4')};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;

  input[type='file'] {
    opacity: 0;
    position: absolute;
    border-radius: 100%;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
  &:hover {
    transition: all 1s;
    box-shadow: 0px 0px 15px 2px ${props => props.hoverColor};
  }
`

export default ImageUploader
