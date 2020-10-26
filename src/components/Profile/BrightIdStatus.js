import React, { useCallback, useState } from 'react'
import {
  ButtonBase,
  GU,
  Info,
  Link,
  Tag,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import IdentityBadge from '../IdentityBadge'
import BrightIdModal from './BrightIdModal'

import { useWallet } from '../../providers/Wallet'
import { useBrightIdVerification } from '../../hooks/useBrightIdVerification'

import verifiedCheck from '../../assets/verifiedCheck.svg'

function BrightIdStatus({ onVerify }) {
  const [brightIdModalVisible, setBrightIdModalVisible] = useState(false)
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const { sponsorshipInfo, brightIdVerificationInfo } = useBrightIdVerification(
    connectedAccount
  )
  const {
    userAddresses,
    userSponsored,
    userVerified,
  } = brightIdVerificationInfo

  const primaryAddress = userAddresses.length > 0 ? userAddresses[0] : ''

  const handleOnVerifyBrightId = useCallback(() => {
    setBrightIdModalVisible(true)
  }, [])

  const handleOnCloseModal = useCallback(() => {
    setBrightIdModalVisible(false)
  }, [])

  return (
    <>
      <>
        {(() => {
          if (primaryAddress && userVerified) {
            return (
              <div
                css={`
                  display: flex;
                `}
              >
                <IdentityBadge entity={primaryAddress} />
                <img
                  src={verifiedCheck}
                  css={`
                    margin-left: ${2 * GU}px;
                  `}
                />
              </div>
            )
          }

          if (!sponsorshipInfo.availableSponsorships) {
            return (
              <Info mode="warning">
                Unfortunately we don’t have more sponsorships available, please
                contact us on the{' '}
                <Link href="https://discord.gg/sBzpmxK">1Hive Discord</Link>
              </Info>
            )
          }

          if (!userSponsored) {
            return (
              <div>
                <Tag
                  background={theme.negativeSurface.toString()}
                  color={theme.negative.toString()}
                >
                  Not verified
                </Tag>
                <ButtonBase
                  onClick={handleOnVerifyBrightId}
                  css={`
                    ${textStyle('label1')};
                    color: ${theme.positive};
                    margin-left: ${3 * GU}px;
                  `}
                >
                  Verify
                </ButtonBase>
              </div>
            )
          }
          if (!userVerified) {
            return (
              <Info mode="warning">
                You are yet to be identified as a unique individual by BrightID
              </Info>
            )
          }
        })()}
      </>
      <BrightIdModal
        visible={brightIdModalVisible}
        addressExist={brightIdVerificationInfo.addressExist}
        onClose={handleOnCloseModal}
      />
    </>
  )
}

export default BrightIdStatus
