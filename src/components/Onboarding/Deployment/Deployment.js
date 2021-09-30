import React, { useMemo } from 'react'
import { Button, GU, LoadingRing, springs, useViewport } from '@1hive/1hive-ui'
import { animated, Transition } from 'react-spring/renderprops'
import { BoxProgress, BoxReady } from './Boxes'
import DeploymentStepsPanel from './DeploymentStepsPanel'
import ErrorModal from './ErrorModal'

import useDeploymentState from './useDeploymentState'

import flowersLeavesSvg from './assets/flowers-leaves.svg'
import gardensLogo from '@assets/gardensLogoMark.svg'

import {
  STEP_WORKING,
  STEP_SUCCESS,
  STEP_PROMPTING,
} from '@components/Stepper/stepper-statuses'

const Deployment = React.memo(function Deployment({ onOpenOrg }) {
  const { above } = useViewport()

  const {
    erroredTransactions,
    onNextAttempt,
    ready,
    transactionsStatus,
  } = useDeploymentState()

  const [pending, allSuccess] = useMemo(() => {
    if (transactionsStatus.length === 0) {
      return [0, false]
    }
    return [
      transactionsStatus.findIndex(
        ({ status }) => status === STEP_WORKING || status === STEP_PROMPTING
      ),
      transactionsStatus[transactionsStatus.length - 1].status === STEP_SUCCESS,
    ]
  }, [transactionsStatus])
  return (
    <React.Fragment>
      {above('large') && (
        <div
          css={`
            width: ${41 * GU}px;
            flex-shrink: 0;
            flex-grow: 0;
            min-height: 100%;
          `}
        >
          <img
            css={`
              display: flex;
              padding-left: ${2.25 * GU}px;
              margin-top: ${2 * GU}px;
            `}
            src={gardensLogo}
            height={32}
            alt=""
          />
          {ready ? (
            <DeploymentStepsPanel
              allSuccess={allSuccess}
              pending={pending}
              transactionsStatus={transactionsStatus}
            />
          ) : (
            <div
              css={`
                display: flex;
                align-items: center;
                margin: ${5 * GU}px ${2 * GU}px;
              `}
            >
              <LoadingRing />
              <span
                css={`
                  margin-left: ${1 * GU}px;
                `}
              >
                Loading transactions
              </span>
            </div>
          )}
        </div>
      )}
      <section
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
          position: relative;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            position: relative;
            overflow: hidden;
          `}
        >
          <Transition
            native
            reset
            unique
            items={allSuccess}
            from={{ opacity: 0, transform: `translate3d(10%, 0, 0)` }}
            enter={{ opacity: 1, transform: `translate3d(0%, 0, 0)` }}
            leave={{ opacity: 0, transform: `translate3d(-10%, 0, 0)` }}
            config={springs.smooth}
          >
            {allSuccess =>
              /* eslint-disable react/prop-types */
              ({ opacity, transform }) =>
                allSuccess ? (
                  <BoxReady
                    onOpenOrg={onOpenOrg}
                    opacity={opacity}
                    boxTransform={transform}
                  />
                ) : (
                  <BoxProgress
                    allSuccess={allSuccess}
                    boxTransform={transform}
                    opacity={opacity}
                    pending={pending}
                    transactionsStatus={transactionsStatus}
                  />
                )
            /* eslint-enable react/prop-types */
            }
          </Transition>
        </div>
        <Transition
          native
          reset
          unique
          items={allSuccess}
          from={{ opacity: 0, transform: `translate3d(0, 20%, 0)` }}
          enter={{ opacity: 1, transform: `translate3d(0, 0%, 0)` }}
          leave={{ opacity: 0, transform: `translate3d(0, 20%, 0)` }}
          config={springs.smooth}
        >
          {allSuccess => ({ opacity, transform }) =>
            !allSuccess && (
              <animated.div
                style={{ opacity, transform }}
                css={`
                  background: url(${flowersLeavesSvg});
                  background-size: cover;
                  background-repeat: no-repeat;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  aspect-ratio: 15 / 4;
                `}
              />
            )}
        </Transition>
      </section>
      <ErrorModal
        action={
          <Button mode="strong" onClick={onNextAttempt}>
            OK, let’s try again
          </Button>
        }
        content={
          <p>
            An error has occurred during the signature process. Don't worry, you
            can try to send the transaction again.
          </p>
        }
        header="Something went wrong"
        visible={erroredTransactions > -1}
      />
    </React.Fragment>
  )
})

export default Deployment
