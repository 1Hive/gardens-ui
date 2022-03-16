import React, { useEffect, useState } from 'react'
import {
  GU,
  shortenAddress,
  textStyle,
  useTheme,
  EthIdenticon,
} from '@1hive/1hive-ui'
import ProposalIcon from '@components/ProposalIcon'

import { convertToString } from '@/types'
import { getProfileForAccount } from '@lib/profile'
import { dateFormat } from '@utils/date-utils'
import { addressesEqual } from '@utils/web3-utils'
import { ZERO_ADDR } from '@/constants'
import { ProposalType } from '@/types/app'

const addressCache = new Map()

type ProposalCreatorProps = {
  proposal: ProposalType
  onViewProfile: () => void
}

function ProposalCreator({ proposal, onViewProfile }: ProposalCreatorProps) {
  const theme = useTheme()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      if (addressCache.get(proposal.creator)) {
        setProfile(addressCache.get(proposal.creator))
        return
      }

      const profile = await getProfileForAccount(proposal.creator)
      if (profile && !cancelled) {
        const profileData = { name: profile.name, image: profile.image }
        setProfile(profileData)
        addressCache.set(proposal.creator, profileData)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [proposal.creator])

  const ProposalType = (
    <>
      <ProposalIcon type={proposal.type} /> {convertToString(proposal.type)}
    </>
  )

  return (
    <div
      css={`
        display: flex;
        cursor: pointer;
      `}
    >
      <div onClick={onViewProfile} style={{ cursor: 'pointer' }}>
        {profile?.image ? (
          <img
            src={profile.image}
            height="43"
            width="43"
            alt=""
            css={`
              border-radius: 50%;
              display: block;
              object-fit: cover;§
            `}
          />
        ) : (
          <EthIdenticon address={proposal.creator} radius={50} scale={1.8} />
        )}
      </div>
      <div
        css={`
          margin-left: ${1 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          {addressesEqual(proposal.creator, ZERO_ADDR) ? (
            ProposalType
          ) : (
            <>
              <strong
                css={`
                  margin-right: ${1 * GU}px;
                `}
                onClick={onViewProfile}
                style={{ cursor: 'pointer' }}
              >
                {profile?.name
                  ? profile.name
                  : shortenAddress(proposal.creator)}
              </strong>
              <span
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              >
                created a
              </span>{' '}
              {ProposalType}
            </>
          )}
        </div>
        <div
          css={`
            ${textStyle('body3')};
            color: ${theme.contentSecondary};
          `}
        >
          {dateFormat(proposal.createdAt, 'custom')}
        </div>
      </div>
    </div>
  )
}

export default ProposalCreator
