import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Transition, animated } from 'react-spring/renderprops'
import { GU, noop, springs, useTheme } from '@1hive/1hive-ui'
import Step from './Step/Step'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from './stepper-statuses'
import { TRANSACTION_SIGNING_DESC } from './stepper-descriptions'
import { useDisableAnimation } from '../../hooks/useDisableAnimation'
import { useMounted } from '../../hooks/useMounted'
import useStepperLayout from './useStepperLayout'

const AnimatedDiv = animated.div

const INITIAL_STATUS = STEP_PROMPTING

const DEFAULT_DESCRIPTIONS = TRANSACTION_SIGNING_DESC

function initialStepState(steps) {
  return steps.map((_, i) => {
    return {
      status: i === 0 ? INITIAL_STATUS : STEP_WAITING,
      hash: null,
    }
  })
}

function reduceSteps(steps, [action, stepIndex, value]) {
  if (action === 'setHash') {
    steps[stepIndex].hash = value
    return [...steps]
  }
  if (action === 'setStatus') {
    steps[stepIndex].status = value
    return [...steps]
  }
  return steps
}

function Stepper({ steps, onComplete, onCompleteActions }) {
  const theme = useTheme()
  const mounted = useMounted()
  const [animationDisabled, enableAnimation] = useDisableAnimation()
  const [stepperStage, setStepperStage] = useState(0)
  const [stepState, updateStep] = useReducer(
    reduceSteps,
    initialStepState(steps)
  )

  const { outerBoundsRef, innerBoundsRef, layout } = useStepperLayout()

  const stepsCount = steps.length - 1

  const renderStep = useCallback(
    (stepIndex, showDivider) => {
      const { title, descriptions: suppliedDescriptions } = steps[stepIndex]
      const { status, hash } = stepState[stepIndex]
      const descriptions = suppliedDescriptions || DEFAULT_DESCRIPTIONS

      return (
        <li
          key={stepIndex}
          css={`
            display: flex;
          `}
        >
          <Step
            title={title}
            desc={descriptions[status]}
            number={stepIndex + 1}
            status={status}
            showDivider={showDivider}
            transactionHash={hash}
            withoutFirstStep={steps.length === 1}
          />
        </li>
      )
    },
    [stepState, steps]
  )

  const renderSteps = useCallback(() => {
    return steps.map((_, index) => {
      const showDivider =
        index < stepsCount && stepState[index].status !== STEP_WAITING

      return renderStep(index, showDivider)
    })
  }, [renderStep, steps, stepsCount, stepState])

  const updateStepStatus = useCallback(
    status => {
      if (mounted()) {
        updateStep(['setStatus', stepperStage, status])
      }
    },
    [stepperStage, mounted]
  )

  const updateHash = useCallback(
    hash => {
      if (mounted()) {
        updateStep(['setHash', stepperStage, hash])
      }
    },
    [stepperStage, mounted]
  )

  const handleSign = useCallback(() => {
    const { handleSign } = steps[stepperStage]

    updateStepStatus(INITIAL_STATUS)

    // Pass state updates as render props to handleSign
    handleSign({
      setPrompting: () => updateStepStatus(STEP_PROMPTING),
      setWorking: () => updateStepStatus(STEP_WORKING),
      setError: () => {
        updateStepStatus(STEP_ERROR)
      },
      setSuccess: () => {
        updateStepStatus(STEP_SUCCESS)

        // Advance to next step or fire complete callback
        if (mounted()) {
          if (stepperStage === stepsCount) {
            onComplete()
          } else {
            setStepperStage(stepperStage + 1)
          }
        }
      },
      setHash: hash => updateHash(hash),
    })
  }, [
    mounted,
    onComplete,
    steps,
    stepperStage,
    stepsCount,
    updateStepStatus,
    updateHash,
  ])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (steps.length > 0) {
      handleSign()
    }
  }, [stepperStage])
  /* eslint-enable react-hooks/exhaustive-deps */

  const completed =
    stepperStage === stepsCount &&
    stepState[stepperStage].status === STEP_SUCCESS

  return (
    <div
      css={`
        margin-top: ${3.25 * GU}px;
        margin-bottom: ${(completed && onCompleteActions ? 0 : 5.5) * GU}px;
      `}
    >
      <div
        ref={outerBoundsRef}
        css={`
          display: flex;
          justify-content: center;
        `}
      >
        <ul
          ref={innerBoundsRef}
          css={`
            padding: 0;
            display: flex;
            flex-direction: ${layout === 'collapsed' ? 'column' : 'row'};
          `}
        >
          {layout === 'collapsed' && (
            <>
              {steps.length > 1 && (
                <p
                  css={`
                    text-align: center;
                    margin-bottom: ${2 * GU}px;
                    color: ${theme.contentSecondary};
                  `}
                >
                  {stepperStage + 1} out of {steps.length} transactions
                </p>
              )}

              <div
                css={`
                  position: relative;
                `}
              >
                <Transition
                  config={springs.smooth}
                  delay={300}
                  items={stepperStage}
                  immediate={animationDisabled}
                  onStart={enableAnimation}
                  from={{
                    opacity: 0,
                    transform: `translate3d(${10 * GU}px, 0, 0)`,
                  }}
                  enter={{
                    opacity: 1,
                    transform: 'translate3d(0, 0, 0)',
                  }}
                  leave={{
                    opacity: 0,
                    transform: `translate3d(-${20 * GU}px, 0, 0)`,
                  }}
                  native
                >
                  {currentStage => animProps => (
                    <AnimatedDiv
                      style={{
                        position:
                          currentStage === stepperStage ? 'static' : 'absolute',
                        ...animProps,
                      }}
                    >
                      {renderStep(currentStage)}
                    </AnimatedDiv>
                  )}
                </Transition>
              </div>
            </>
          )}
          {layout === 'expanded' && renderSteps()}
        </ul>
      </div>
      {completed && onCompleteActions && (
        <div
          css={`
            margin-top: ${5 * GU}px;
          `}
        >
          {onCompleteActions()}
        </div>
      )}
    </div>
  )
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      handleSign: PropTypes.func.isRequired,
      descriptions: PropTypes.shape({
        [STEP_WAITING]: PropTypes.string,
        [STEP_PROMPTING]: PropTypes.string,
        [STEP_WORKING]: PropTypes.string,
        [STEP_SUCCESS]: PropTypes.string,
        [STEP_ERROR]: PropTypes.string,
      }),
    })
  ).isRequired,
  onComplete: PropTypes.func,
  onCompleteActions: PropTypes.func,
}

Stepper.defaultProps = {
  onComplete: noop,
}

export default Stepper
