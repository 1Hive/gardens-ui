import { useEffect, useState } from 'react'
import { useAppState } from '../providers/AppState'
import { getNetwork } from '../networks'
import { getSpaceThread } from '../lib/3box'
import { useProfile } from '../providers/Profile'

export default function useThread(proposalId) {
  const { convictionVoting } = useAppState()
  const { space } = useProfile()
  const [thread, setThread] = useState(null)

  const threadName = `proposal#${proposalId}`
  const spaceName = `honeypot-${getNetwork().type}${convictionVoting.address}` // TODO: Move to separate file

  useEffect(() => {
    let cancelled = false
    const fetchThread = async () => {
      let thread
      if (!space) {
        thread = await getSpaceThread(spaceName, threadName)
      } else {
        thread = await space.joinThread(threadName)
      }

      if (!cancelled) {
        setThread(thread)
      }
    }

    fetchThread()

    return () => (cancelled = true)
  }, [proposalId, space, spaceName, threadName])

  return thread
}
