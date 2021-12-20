import { useEffect, useState } from 'react'
import { uploadToPinata } from '@/services/pinata'
import { useMounted } from './useMounted'

const RETRY_EVERY = 2000
const MAX_RETRIES = 3

export default function usePinataUploader(file: Blob, ready: string) {
  const [ipfsHash, setIpfsHash] = useState(null)
  const [error, setError] = useState(false)
  const mounted = useMounted()

  useEffect(() => {
    if (!ready) {
      return
    }

    let retries = 0
    let retryTimer: number

    const upload = async () => {
      const pinataResult = await uploadToPinata(file)

      if (mounted() && !pinataResult.error) {
        setIpfsHash(pinataResult.data.IpfsHash)
        return
      }

      if (retries <= MAX_RETRIES) {
        retries++
        retryTimer = window.setTimeout(upload, RETRY_EVERY)
      } else {
        setError(true)
      }
    }

    upload()

    return () => {
      clearTimeout(retryTimer)
    }
  }, [file, mounted, ready])

  return [ipfsHash, error]
}
