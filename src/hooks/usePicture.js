import { useCallback, useEffect, useState } from 'react'

const DEFAULT_STATE = {
  buffer: null,
  updated: false,
  removed: false,
}

export default function usePicture(refresh) {
  const [picture, setPicture] = useState(DEFAULT_STATE)
  const handleProfilePicChange = useCallback(event => {
    const newPhotoFile = event.target.files[0]

    if (newPhotoFile.size >= 2500000) {
      console.error('File exceeds 2.5 MB')
    }

    const formData = new FormData()
    formData.append('path', newPhotoFile)

    setPicture({ buffer: formData, updated: true, removed: false })
  }, [])

  const handleProfilePicRemoval = useCallback(() => {
    setPicture({ buffer: null, updated: false, removed: true })
  }, [])

  useEffect(() => {
    if (refresh) {
      setPicture(DEFAULT_STATE)
    }
  }, [refresh])

  return [picture, handleProfilePicChange, handleProfilePicRemoval]
}
