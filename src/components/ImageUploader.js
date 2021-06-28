import React, { useCallback, useState } from 'react'
import { GU, IconCloudUpload, IconClose, useTheme } from '@1hive/1hive-ui'
import styled from 'styled-components'

function ImageUploader({ onImageSelected }) {
  const theme = useTheme()
  // const [file, setFile] = useState()
  const [imagePreview, setImagePreview] = useState('')
  const [base64, setBase64] = useState()
  // const [name, setName] = useState()
  // const [size, setSize] = useState()
  const [isLoading, setIsLoading] = useState(false)

  console.log(isLoading)

  const photoUpload = e => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    console.log('reader', reader)
    console.log('file', file)
    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        // setFile(file)
        // setSize(file.size)
        // setName(file.name)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onFileSubmit = useCallback(
    e => {
      setIsLoading(true)
      e.preventDefault()
      console.log('bine', base64)
      const payload = { image: base64 }
      console.log('payload', payload)

      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    },
    [base64]
  )

  const onChange = e => {
    console.log('file', e.target.files[0])
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = _handleReaderLoaded
      reader.readAsBinaryString(file)
    }
  }

  const _handleReaderLoaded = readerEvt => {
    const binaryString = readerEvt.target.result
    setBase64(btoa(binaryString))
  }

  console.log('base 64 ', base64)
  return (
    <form onSubmit={e => onFileSubmit(e)} onChange={e => onChange(e)}>
      <Container
        width={imagePreview === '' ? 95 : 105}
        height={imagePreview === '' ? 95 : 105}
        hoverColor={theme.selected}
      >
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
              `}
            >
              <IconClose size="medium" />
            </div>
          </>
        )}
        <input
          type="file"
          name="avatar"
          id="file"
          accept=".jpef, .png, .jpg"
          onChange={photoUpload}
          src={imagePreview}
        />
      </Container>
    </form>
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
    width: 145px;
    height: 145px;
  }
  &:hover {
    transition: all 1s;
    box-shadow: 0px 0px 15px 2px ${props => props.hoverColor};
  }
`
export default ImageUploader
