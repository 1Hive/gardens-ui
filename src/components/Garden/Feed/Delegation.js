import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import {
  Box,
  Button,
  EthIdenticon,
  GU,
  Link,
  LoadingRing,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import useProfile from '@hooks/useProfile'
import { useSupporterSubscription } from '@hooks/useSubscriptions'
import { useWallet } from '@providers/Wallet'

function Delegation({ onDelegateVoting }) {
  const { account } = useWallet()
  const theme = useTheme()
  const [supporter, loading] = useSupporterSubscription(account)

  return (
    <Box>
      {loading ? (
        <LoadingRing />
      ) : (
        <div
          css={`
            text-align: center;
          `}
        >
          <div
            css={`
              ${textStyle('title4')};
            `}
          >
            Your delegate
          </div>
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            {supporter?.representative ? (
              <Representative
                onDelegateVoting={onDelegateVoting}
                representative={supporter.representative}
              />
            ) : (
              <div
                css={`
                  text-align: center;
                `}
              >
                <div
                  css={`
                    ${textStyle('body1')};
                  `}
                >
                  None
                </div>
                <span
                  css={`
                    ${textStyle('body3')};
                    color: ${theme.contentSecondary};
                  `}
                >
                  (You vote for yourself)
                </span>
                <Button
                  mode="strong"
                  label="Delegate voting"
                  wide
                  onClick={onDelegateVoting}
                  css={`
                    margin-top: ${3 * GU}px;
                  `}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Box>
  )
}

function Representative({ onDelegateVoting, representative }) {
  const profile = useProfile(representative.address)
  const history = useHistory()

  const handleViewProfile = useCallback(() => {
    history.push(`/profile?account=${representative.address}`)
  }, [history, representative])

  return (
    <div>
      <div
        onClick={handleViewProfile}
        css={`
          margin-bottom: ${1 * GU}px;
          cursor: pointer;
        `}
      >
        {profile?.image ? (
          <img
            src={profile.image}
            height="72"
            width="72"
            alt=""
            css={`
              border-radius: 50%;
              display: block;
              object-fit: cover;
              margin: 0 auto;
            `}
          />
        ) : (
          <EthIdenticon
            address={representative.address}
            radius={50}
            scale={3}
          />
        )}
      </div>
      {profile?.name && (
        <div
          css={`
            ${textStyle('body1')};
          `}
        >
          {profile.name}
        </div>
      )}
      <div>{shortenAddress(representative.address)}</div>
      <Link onClick={onDelegateVoting}>Manage</Link>
    </div>
  )
}

export default Delegation
