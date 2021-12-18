import { useEffect, useState } from 'react'
import { CONTEXT_ID } from '../constants'
import {
  BRIGHTID_1HIVE_INFO_ENDPOINT,
  BRIGHTID_VERIFICATION_ENDPOINT,
} from '../endpoints'
import {
  ERROR_CODE,
  NOT_FOUND_CODE,
  CAN_NOT_BE_VERIFIED,
  NOT_SPONSORED_CODE,
} from '../services/brightIdResponseCodes'

const REQUEST_TIMEOUT = 60000

export async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit | undefined
) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })

  clearTimeout(id)

  return response
}

export function useBrightIdVerification(account: string) {
  const [verificationInfo, setVerificationInfo] = useState({
    addressExist: false,
    addressUnique: false,
    signature: null,
    timestamp: 0,
    userAddresses: [],
    userSponsored: false,
    userVerified: false,
    error: null,
    fetching: true,
  })
  const [sponsorshipInfo, setSponsorshipInfo] = useState({
    availableSponsorships: 0,
    error: false,
  })

  useEffect(() => {
    let cancelled = false
    let retryTimer: number

    const fetchSponsorshipInfo = async () => {
      if (!account) {
        return
      }

      try {
        const rawResponse = await fetchWithTimeout(
          BRIGHTID_1HIVE_INFO_ENDPOINT,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )

        if (!rawResponse.ok) {
          setSponsorshipInfo({
            ...sponsorshipInfo,
            error: true,
          })
        }

        const response = await rawResponse.json()
        if (!cancelled) {
          setSponsorshipInfo({
            availableSponsorships: response?.data?.unusedSponsorships,
            error: false,
          })
        }
      } catch (err) {
        setSponsorshipInfo({
          ...sponsorshipInfo,
          error: true,
        })
      }
    }

    fetchSponsorshipInfo()

    return () => {
      cancelled = true
      window.clearTimeout(retryTimer)
    }
  }, [account])

  useEffect(() => {
    let cancelled = false
    let retryTimer: number

    if (!account) {
      return setVerificationInfo(info => ({ ...info, fetching: false }))
    }

    const fetchVerificationInfo = async () => {
      if (sponsorshipInfo.availableSponsorships === 0) {
        return
      }

      const endpoint = `${BRIGHTID_VERIFICATION_ENDPOINT}/${CONTEXT_ID}/${account}?signed=eth&timestamp=seconds`
      try {
        const rawResponse = await fetchWithTimeout(endpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })

        const response = await rawResponse.json()

        if (!cancelled) {
          switch (response.code) {
            case ERROR_CODE:
              setVerificationInfo({
                ...verificationInfo,
                error: response.errorMessage,
                fetching: false,
              })
              break

            case NOT_FOUND_CODE:
              // If the users didn't link their address to the their BrightId account or cannot be verified for the context (meaning is unverified on the BrightId app)
              setVerificationInfo({
                ...verificationInfo,
                addressExist: response.errorNum === CAN_NOT_BE_VERIFIED,
                addressUnique: false,
                timestamp: 0,
                userAddresses: [],
                userSponsored: response.errorNum === CAN_NOT_BE_VERIFIED,
                userVerified: false,
                fetching: false,
              })
              break

            case NOT_SPONSORED_CODE:
              setVerificationInfo({
                ...verificationInfo,
                addressExist: true,
                addressUnique: false,
                timestamp: 0,
                userAddresses: [],
                userSponsored: false,
                userVerified: false,
                fetching: false,
              })
              break

            default:
              setVerificationInfo({
                ...verificationInfo,
                addressExist: true,
                addressUnique: response.data?.unique,
                signature: { ...response.data?.sig },
                timestamp: response.data?.timestamp,
                userAddresses: response.data?.contextIds,
                userSponsored: true,
                userVerified: true,
                fetching: false,
              })
              break
          }
        }
      } catch (err) {
        console.error(`Could not fetch verification info `, err)
      }
    }

    fetchVerificationInfo()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [account, sponsorshipInfo.availableSponsorships])

  return { sponsorshipInfo, brightIdVerificationInfo: verificationInfo }
}
