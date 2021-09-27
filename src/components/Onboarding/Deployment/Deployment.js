import React, { useMemo } from 'react'
import { Button, GU, springs, useViewport } from '@1hive/1hive-ui'
import { Transition } from 'react-spring/renderprops'
import { BoxProgress, BoxReady } from './Boxes'
import DeploymentStepsPanel from './DeploymentStepsPanel'
import ErrorModal from './ErrorModal'

import useDeploymentState from './useDeploymentState'

import {
  STEP_WORKING,
  STEP_SUCCESS,
} from '@components/Stepper/stepper-statuses'

// import progressImgLarge from './assets/illustration-progress-large.svg'
// import progressImgMedium from './assets/illustration-progress-medium.svg'
// import allDoneImg from './assets/illustration-all-done.png'

const Deployment = React.memo(function Deployment({ onOpenOrg, ready }) {
  const { above } = useViewport()

  const {
    erroredTransactions,
    transactionsStatus,
    onNextAttempt,
  } = useDeploymentState()

  // TODO: handle transaction error
  const [pending, allSuccess] = useMemo(() => {
    if (transactionsStatus.length === 0) {
      return [0, false]
    }
    return [
      transactionsStatus.findIndex(({ status }) => status === STEP_WORKING),
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
          `}
        >
          <DeploymentStepsPanel
            allSuccess={allSuccess}
            pending={pending}
            transactionsStatus={transactionsStatus}
          />
        </div>
      )}
      <section
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
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
            items={ready}
            from={{ opacity: 0, transform: `translate3d(10%, 0, 0)` }}
            enter={{ opacity: 1, transform: `translate3d(0%, 0, 0)` }}
            leave={{ opacity: 0, transform: `translate3d(-10%, 0, 0)` }}
            config={springs.smooth}
          >
            {ready =>
              /* eslint-disable react/prop-types */
              ({ opacity, transform }) =>
                ready ? (
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
