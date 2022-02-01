/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useCallback } from 'react'
import { useWallet } from '../../providers/Wallet'
import { noop } from '@1hive/1hive-ui'
import { useSteps } from '../../hooks/useSteps'

type State = {
  currentScreen: any
  close: () => void
  direction: any
  getScreen: any
  next: any
  prev: any
  step: any
}

const MultiModalContext = React.createContext<State>({
  currentScreen: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
  direction: null,
  getScreen: null,
  next: null,
  prev: null,
  step: null,
})

type MultiModalProviderType = {
  screens: Array<any>
  onClose: () => void
  children: React.ReactNode
}

function MultiModalProvider({
  screens,
  onClose,
  children,
}: MultiModalProviderType) {
  const { account } = useWallet()
  const { direction, next, prev, setStep, step } = useSteps(screens.length)
  const getScreen = useCallback((step) => screens[step], [screens])
  const currentScreen = useMemo(() => getScreen(step), [getScreen, step])

  const handleClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    setStep(0)
  }, [account])

  const multiModalState = useMemo(
    () => ({
      // Prevent destructure errors if screens length is dynamically reduced below current index
      currentScreen: currentScreen || {},
      close: handleClose,
      direction,
      getScreen,
      next,
      prev,
      step,
    }),
    [currentScreen, direction, getScreen, next, prev, step, handleClose]
  )

  return (
    <MultiModalContext.Provider value={multiModalState}>
      {children}
    </MultiModalContext.Provider>
  )
}

MultiModalProvider.defaultProps = {
  onClose: noop,
}

function useMultiModal() {
  return useContext(MultiModalContext)
}

export { MultiModalProvider, useMultiModal }
