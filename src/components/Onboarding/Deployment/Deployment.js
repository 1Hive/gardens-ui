import { BoxProgress, BoxReady } from './Boxes'
import DeploymentStepsPanel from './DeploymentStepsPanel'
import ErrorModal from './ErrorModal'
import flowersLeavesSvg from './assets/flowers-leaves.svg'
import flowersLeavesDarkSvg from './assets/flowers-leaves-dark.svg'
import useDeploymentState from './useDeploymentState'
import { Button, GU, LoadingRing, springs, useViewport } from '@1hive/1hive-ui'
import { useWallet } from '@/providers/Wallet'
import { useAppTheme } from '@/providers/AppTheme'
import { getNetworkType } from '@/utils/web3-utils'
import { IndividualStepTypes } from '@components/Stepper/stepper-statuses'
import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { animated, Transition } from 'react-spring/renderprops.cjs'

const Deployment = React.memo(function Deployment() {
  const { appearance } = useAppTheme()
  const { above } = useViewport()
  const router = useRouter()
  const { chainId } = useWallet()

  const {
    erroredTransactions,
    gardenAddress,
    isFinalized,
    onNextAttempt,
    onReset,
    readyToStart,
    transactionsStatus,
  } = useDeploymentState()

  const handleGetStarted = useCallback(() => {
    if (gardenAddress && isFinalized) {
      router.push(`/${getNetworkType(chainId)}/garden/${gardenAddress}`)
      onReset()
    }
  }, [chainId, gardenAddress, router, isFinalized, onReset])

  const [pending, allSuccess] = useMemo(() => {
    if (transactionsStatus.length === 0) {
      return [0, false]
    }
    return [
      transactionsStatus.findIndex(
        ({ status }) =>
          status === IndividualStepTypes.Working ||
          status === IndividualStepTypes.Prompting
      ),
      transactionsStatus[transactionsStatus.length - 1].status ===
        IndividualStepTypes.Success,
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
            src={'/icons/base/gardensLogoMark.svg'}
            height={32}
            alt=""
          />
          {readyToStart ? (
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
            {
              (allSuccess) =>
                /* eslint-disable react/prop-types */
                ({ opacity, transform }) =>
                  allSuccess ? (
                    <BoxReady
                      isFinalized={isFinalized}
                      onGetStarted={handleGetStarted}
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
          items={isFinalized}
          from={{ opacity: 0, transform: `translate3d(0, 20%, 0)` }}
          enter={{ opacity: 1, transform: `translate3d(0, 0%, 0)` }}
          leave={{ opacity: 0, transform: `translate3d(0, 20%, 0)` }}
          config={springs.smooth}
        >
          {(isFinalized) =>
            ({ opacity, transform }) =>
              !isFinalized && (
                <animated.div
                  style={{ opacity, transform }}
                  css={`
                    background: url(${appearance === 'light'
                      ? flowersLeavesSvg
                      : flowersLeavesDarkSvg});
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
            An error has occurred during the signature process. Don&apos;t
            worry, you can try to send the transaction again.
          </p>
        }
        header="Something went wrong"
        visible={erroredTransactions > -1}
      />
    </React.Fragment>
  )
})

export default Deployment
