import { useCallback } from 'react'

import { writeText as copy } from 'clipboard-polyfill'

import { useToast } from '@1hive/1hive-ui'

export function useCopyToClipboard() {
  const toast = useToast()
  return useCallback(
    (text, confirmationMessage = 'Copied') => {
      copy(text)
      if (confirmationMessage) {
        toast(confirmationMessage)
      }
    },
    [toast]
  )
}
