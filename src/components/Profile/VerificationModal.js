import React, { useCallback, useState } from 'react'
import {
  Button,
  GU,
  Info,
  Link,
  LoadingRing,
  Modal,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { getAccountAttributes } from './accounts'

// Assumes modal visible
function VerificationModal({ account, did, onClose, onVerify, verified }) {
  const theme = useTheme()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const {
    verificationActionDescription,
    verificationActionLabel,
    verificationActionUrl,
  } = getAccountAttributes(account)

  const accountText = capitalize(account)

  const handleVerification = useCallback(async () => {
    try {
      setLoading(true)
      await onVerify()
    } catch (err) {
      setError(true)
      console.error(err)
    }
    setLoading(false)
  }, [onVerify])

  return (
    <Modal onClose={onClose} visible>
      <div>
        <div
          css={`
            padding-bottom: ${2 * GU}px;
            border-bottom: 1px solid ${theme.border};
          `}
        >
          <h3
            css={`
              ${textStyle('title2')};
            `}
          >
            Verify your {accountText} account
          </h3>
        </div>
        <div
          css={`
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: ${3 * GU}px;
            padding-top: ${3 * GU}px;
          `}
        >
          <Step
            action={verificationActionLabel}
            info={did}
            link={verificationActionUrl(did)}
            number={1}
            text={verificationActionDescription}
          />
          <Step
            action="Verify"
            info={
              verified ? (
                'Verification successful!'
              ) : error ? (
                'Verification failed'
              ) : loading ? (
                <LoadingRing />
              ) : (
                'Not yet verified'
              )
            }
            number={2}
            text={`Check if your ${accountText} account was successfully verified below!`}
            onClick={handleVerification}
          />
        </div>
        <div
          css={`
            text-align: right;
          `}
        >
          <Button label="Done" mode="strong" />
        </div>
      </div>
    </Modal>
  )
}

function Step({ action, info, link, number, text, onClick }) {
  const theme = useTheme()

  return (
    <div>
      <div
        css={`
          background: ${theme.accent};
          color: ${theme.surface};
          margin-bottom: ${3 * GU}px;
          text-align: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          align-items: center;
          display: flex;
          justify-content: center;
          padding: ${2.5 * GU}px;
        `}
      >
        <span>{number}</span>
      </div>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          color: ${theme.contentSecondary};
        `}
      >
        {text}
      </div>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
          word-break: break-word;
          min-height: 100px;
        `}
      >
        {info}
      </Info>
      <Button
        label={
          link ? (
            <Link
              href={link}
              external
              css={`
                color: ${theme.content};
                text-decoration: none;
              `}
            >
              {action}
            </Link>
          ) : (
            action
          )
        }
        onClick={onClick}
      />
    </div>
  )
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export default VerificationModal
