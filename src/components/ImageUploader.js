import React, { useState } from 'react'
import {
  GU,
  IconCloudUpload,
  IconClose,
  useTheme,
  textStyle,
} from '@1hive/1hive-ui'
import styled from 'styled-components'

const MAX_FILE_SIZE = 1000000 // 1Mb

function ImageUploader({ id, onImageLoaded, onImageRemoved }) {
  const theme = useTheme()
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')

  const photoUpload = e => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    if (file?.size <= MAX_FILE_SIZE) {
      if (reader !== undefined && file !== undefined) {
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setError('Max size 1Mb')
    }
  }

  const onChange = e => {
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
    setImagePreview('')
    document.getElementById(`file-${id}`).value = ''
    onImageRemoved()
  }

  return (
    <div>
      {imagePreview !== '' && (
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
      <form onChange={e => onChange(e)}>
        <Container width={100} height={100} hoverColor={theme.selected}>
          {imagePreview === '' ? (
            <IconCloudUpload
              css={`
                cursor: pointer;
              `}
              size="large"
            />
          ) : (
            <>
              <img src={imagePreview} alt="Icone adicionar" />
            </>
          )}
          <input
            type="file"
            name="avatar"
            id={`file-${id}`}
            accept=".png, .jpg"
            onChange={photoUpload}
            src={imagePreview}
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

export const Container = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  background: #eceff4;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;
  img {
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border-radius: 100%;
    transition: all 1s;
    object-fit: cover;
  }
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
