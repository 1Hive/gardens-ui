import React, { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { keyframes } from 'styled-components'

import { GU, useTheme } from '@1hive/1hive-ui'

import LoadingRing from '@components/LoadingRing'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import MultiModalScreens from '@components/MultiModal/MultiModalScreens'
import Stepper from '@components/Stepper/Stepper'

import { useActivity } from '@providers/ActivityProvider'
import { useWallet } from '@providers/Wallet'

import { setAccountSetting } from '@/local-settings'

const indexNumber = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
}

function ModalFlowBase({
  frontLoad,
  loading,
  screens,
  transactions,
  transactionTitle,
  onComplete,
  onCompleteActions,
}) {
  const { addActivity } = useActivity()
  const { account, chainId, ethers } = useWallet()
  const signer = useMemo(() => ethers.getSigner(), [ethers])

  const transactionSteps = useMemo(
    () =>
      transactions
        ? transactions.map((transaction, index) => {
            const title = transaction.description
              ? transaction.description
              : transactions.length === 1
              ? 'Sign transaction'
              : `${indexNumber[index]} transaction`

            return {
              // TODO: Add titles from description
              title,
              handleSign: async ({
                setSuccess,
                setWorking,
                setError,
                setHash,
              }) => {
                try {
                  const trx = {
                    from: transaction.from,
                    to: transaction.to,
                    data: transaction.data,
                    gasLimit: transaction.gasLimit,
                  }
                  const tx = await signer.sendTransaction(trx)

                  await addActivity(
                    tx,
                    transaction.type,
                    transaction.description
                  )
                  setHash(tx.hash)

                  setWorking()

                  // We need to wait for pre-transactions to mine before asking for the next signature
                  // TODO: Provide a better user experience than waiting on all transactions
                  await tx.wait()

                  setAccountSetting('lastTxHash', account, chainId, tx.hash)

                  setSuccess()
                } catch (err) {
                  console.error(err)
                  setError()
                }
              },
            }
          })
        : null,
    [addActivity, transactions, signer]
  )
  const extendedScreens = useMemo(() => {
    const allScreens = []

    // Add loading screen as first item if enabled
    if (frontLoad) {
      allScreens.push({
        content: <LoadingScreen loading={loading} />,
      })
    }

    // Spread in our flow screens
    if (screens) {
      allScreens.push(...screens)
    }

    // Apply transaction singing at the end
    if (transactionSteps) {
      allScreens.push({
        title: transactionTitle,
        width: modalWidthFromCount(transactions.length),
        content: (
          <Stepper
            steps={transactionSteps}
            onComplete={onComplete}
            onCompleteActions={onCompleteActions}
          />
        ),
      })
    }

    return allScreens
  }, [
    frontLoad,
    loading,
    screens,
    transactions,
    transactionSteps,
    transactionTitle,
    onComplete,
    onCompleteActions,
  ])

  return <MultiModalScreens screens={extendedScreens} />
}

/* eslint-disable react/prop-types */
function LoadingScreen({ loading }) {
  const theme = useTheme()
  const { next } = useMultiModal()

  useEffect(() => {
    let timeout

    if (!loading) {
      // Provide a minimum appearance duration to avoid visual confusion on very fast requests
      timeout = setTimeout(() => {
        next()
      }, 100)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [loading, next])

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        padding-top: ${16 * GU}px;
        padding-bottom: ${16 * GU}px;
      `}
    >
      <div
        css={`
          animation: ${keyframes`
            from {
              transform: scale(1.3);
            }

            to {
              transform: scale(1);
            }
          `} 0.3s ease;
        `}
      >
        <LoadingRing
          css={`
            color: ${theme.accent};
          `}
        />
      </div>
    </div>
  )
}
/* eslint-enable react/prop-types */

function modalWidthFromCount(count) {
  if (count >= 3) {
    return 865
  }

  if (count === 2) {
    return 700
  }

  // Modal will fallback to the default
  return null
}

ModalFlowBase.propTypes = {
  frontLoad: PropTypes.bool,
  loading: PropTypes.bool,
  screens: PropTypes.array,
  transactions: PropTypes.array,
  transactionTitle: PropTypes.string,
}

ModalFlowBase.defaultProps = {
  frontLoad: true,
  transactionTitle: 'Create transaction',
}

export default ModalFlowBase
