import React, { useCallback, useState } from 'react'
import {
  Button,
  isAddress,
  EthIdenticon,
  Field,
  GU,
  RADIUS,
  TextInput,
  useTheme,
  LoadingRing,
} from '@1hive/1hive-ui'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import useProfile from '@hooks/useProfile'
import { useSupporterSubscription } from '@hooks/useSubscriptions'
import { useWallet } from '@providers/Wallet'
import { ZERO_ADDR } from '@/constants'

const DelegateVoting = React.memo(function DelegateVoting({ getTransactions }) {
  const theme = useTheme()
  const { account } = useWallet()
  const { next } = useMultiModal()
  const [representative, setRepresentative] = useState('')
  const profile = useProfile(representative)
  const [supporter, loading] = useSupporterSubscription(account)

  const handleRepresentativeChange = useCallback(event => {
    setRepresentative(event.target.value)
  }, [])

  const handleRemove = useCallback(() => {
    getTransactions(() => {
      next()
    }, ZERO_ADDR)
  }, [getTransactions, next])

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      getTransactions(() => {
        next()
      }, representative || ZERO_ADDR)
    },
    [getTransactions, next, representative]
  )

  const hasRepresentative = Boolean(supporter?.representative)

  // TODO: Add validation for setting own account as represnetative
  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <LoadingRing />
      ) : (
        <div>
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Field
              label={`Your ${
                hasRepresentative ? 'new' : ''
              } delegate´s address`}
              css={`
                width: 100%;
              `}
            >
              <TextInput
                value={representative}
                onChange={handleRepresentativeChange}
                placeholder="0x"
                wide
              />
            </Field>
            {profile && (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-left: ${2 * GU}px;
                `}
              >
                <div>
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      height="36"
                      width="36"
                      alt=""
                      css={`
                        border-radius: ${RADIUS}px;
                        display: block;
                        object-fit: cover;
                        margin: 0 auto;
                      `}
                    />
                  ) : (
                    <EthIdenticon
                      address={representative}
                      radius={50}
                      scale={1.5}
                    />
                  )}
                </div>
                {profile?.name && (
                  <div
                    css={`
                      background: ${theme.tagNew};
                      border-top-right-radius: 4px;
                      border-bottom-right-radius: 4px;
                      padding: 6px;
                    `}
                  >
                    {profile.name}
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
              column-gap: ${2 * GU}px;
            `}
          >
            {hasRepresentative && (
              <Button label="Remove" mode="negative" onClick={handleRemove} />
            )}
            <Button
              label={hasRepresentative ? 'Update delegate' : 'Delegate'}
              wide
              type="submit"
              mode="strong"
              disabled={!isAddress(representative)}
            />
          </div>
        </div>
      )}
    </form>
  )
})

export default DelegateVoting
