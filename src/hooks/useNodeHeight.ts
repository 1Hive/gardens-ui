// TODO: Ask gabi how to test this one
import { useCallback, useRef, useState } from 'react'

export function useNodeHeight() {
  const [height, setHeight] = useState(0)
  const nodeObserver = useRef<ResizeObserver>(null)

  const customRef = useCallback((node) => {
    if (nodeObserver.current) {
      nodeObserver.current.disconnect()
    }

    if (node) {
      setHeight(node.clientHeight)
      new ResizeObserver((entries) => {
        const { y } = entries[0].contentRect
        setHeight(y)
      })

      nodeObserver.current?.observe(node)
    }
  }, [])

  return { height, customRef }
}
