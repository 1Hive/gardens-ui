import React from 'react'
import {
  Box,
  GU,
  isAddress,
  Link,
  LoadingRing,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import IdentityBadge from '@components/IdentityBadge'
import { useGardens } from '@providers/Gardens'
import useUser from '@hooks/useUser'
import { useWallet } from '@providers/Wallet'

import { addressesEqual } from '@utils/web3-utils'
import { getGardenLabel } from '@utils/garden-utils'

function Delegates({ account }) {
  const [user, loading] = useUser(account)

  return (
    <Box heading="Delegate voting" padding={0}>
      {loading ? (
        <div
          css={`
            padding: ${3 * GU}px;
          `}
        >
          <LoadingRing />
        </div>
      ) : (
        <div>
          <MyDelegates account={account} user={user} />
          <DelegateFor user={user} />
        </div>
      )}
    </Box>
  )
}

function MyDelegates({ account, user }) {
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()

  return (
    <div
      css={`
        padding: ${3 * GU}px;
      `}
    >
      <h3
        css={`
          ${textStyle('label2')};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {addressesEqual(account, connectedAccount) ? 'My ' : ''}Delegates
      </h3>
      {user?.supports && user.supports.length > 0 ? (
        user.supports.map((support, index) => {
          if (!support.representative) {
            return null
          }

          return (
            <DelegateItem
              key={index}
              address={support.representative.address}
              gardenAddress={support.organization.id}
            />
          )
        })
      ) : (
        <div
          css={`
            ${textStyle('body3')};
            color: ${theme.contentSecondary};
          `}
        >
          Haven´t chosen anyone as delegate.
        </div>
      )}
    </div>
  )
}

function DelegateFor({ user }) {
  const theme = useTheme()

  return (
    <div
      css={`
        padding: ${3 * GU}px;
        border-top: 1px solid ${theme.border};
      `}
    >
      <h3
        css={`
          ${textStyle('label2')};
          margin-bottom: ${1 * GU}px;
        `}
      >
        Delegate For
      </h3>
      {user?.representativeFor && user.representativeFor.length > 0 ? (
        user.representativeFor.map((principal, index) => {
          return (
            <DelegateItem
              key={index}
              address={principal.user.address}
              gardenAddress={principal.organization.id}
            />
          )
        })
      ) : (
        <div
          css={`
            ${textStyle('body3')};
            color: ${theme.contentSecondary};
          `}
        >
          Delegate for no one.
        </div>
      )}
    </div>
  )
}

const DelegateItem = ({ address, gardenAddress }) => {
  const { gardensMetadata } = useGardens()
  const gardenPath = `/#/garden/${gardenAddress}`
  const gardenLabel = getGardenLabel(gardenAddress, gardensMetadata)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        column-gap: ${0.5 * GU}px;
      `}
    >
      <IdentityBadge
        entity={address}
        compact
        iconSize="18"
        labelStyle={`${textStyle('body3')}`}
      />
      <span>on</span>
      <Link href={gardenPath}>
        {isAddress(gardenLabel) ? shortenAddress(gardenLabel) : gardenLabel}
      </Link>
    </div>
  )
}

export default Delegates
