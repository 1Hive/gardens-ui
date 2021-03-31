import React, { useContext, useEffect, useMemo, useCallback } from 'react'
import { useWallet } from '../../providers/Wallet'
import PropTypes from 'prop-types'
import { noop } from '@1hive/1hive-ui'
import { useSteps } from '../../hooks/useSteps'

const MultiModalContext = React.createContext({})

function MultiModalProvider({ screens, onClose, children }) {
  const { account } = useWallet()
  const { direction, next, prev, setStep, step } = useSteps(screens.length)
  const getScreen = useCallback(step => screens[step], [screens])
  const currentScreen = useMemo(() => getScreen(step), [getScreen, step])

  const handleClose = useCallback(() => onClose(), [onClose])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setStep(0)
  }, [account])
  /* -enable react-hooks/exhaustive-deps */

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

MultiModalProvider.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  screens: PropTypes.array,
}

MultiModalProvider.defaultProps = {
  onClose: noop,
}

function useMultiModal() {
  return useContext(MultiModalContext)
}

export { MultiModalProvider, useMultiModal }
