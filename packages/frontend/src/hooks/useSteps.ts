import { useReducer, useEffect, useCallback } from 'react'

export enum StepActionType {
  SET = 'SET',
  NEXT = 'NEXT',
  PREV = 'PREV',
  ADJUST_SIZE = 'ADJUST_SIZE',
}

type State = {
  step: number
  direction: number
}

type Action = {
  type: StepActionType
  value?: any
  steps?: number
}

function stepsReducer(state: State, action: Action) {
  const { type, value, steps } = action
  const { step } = state
  const stepsCount = steps !== undefined ? steps - 1 : 0

  let newStep = null

  if (type === StepActionType.SET) {
    newStep = value
  }
  if (type === StepActionType.NEXT && step < stepsCount) {
    newStep = step + 1
  }
  if (type === StepActionType.PREV && step > 0) {
    newStep = step - 1
  }
  if (type === StepActionType.ADJUST_SIZE) {
    newStep = step <= stepsCount ? step : stepsCount
  }

  if (newStep !== null && step !== newStep) {
    return {
      step: newStep,
      direction: newStep > step ? 1 : -1,
    }
  }

  return state
}

// Simple hook to manage a given number of steps
export function useSteps(steps: number) {
  const [state, dispatch] = useReducer(stepsReducer, {
    step: 0,
    direction: 0,
  })

  const { step, direction } = state

  // If the number of steps change, we need to remember the current step
  // or use the closest value available
  useEffect(() => {
    dispatch({ type: StepActionType.ADJUST_SIZE, steps })
  }, [steps])

  const setStep = useCallback(
    value => {
      dispatch({ type: StepActionType.SET, value, steps })
    },
    [steps]
  )

  const next = useCallback(() => {
    dispatch({ type: StepActionType.NEXT, steps })
  }, [steps])

  const prev = useCallback(() => {
    dispatch({ type: StepActionType.PREV, steps })
  }, [steps])

  return {
    direction,
    next,
    prev,
    setStep,
    step,
  }
}
