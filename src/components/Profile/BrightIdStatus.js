import React from 'react'
import { ButtonBase, GU, Info, Tag, textStyle, useTheme } from '@1hive/1hive-ui'

function BrightIdStatus({
  brightIdVerificationInfo,
  onVerify,
  sponsorshipInfo,
}) {
  const theme = useTheme()
  const {
    // addressExist,
    // addressUnique,
    // signature,
    // timestamp,
    // userAddresses,
    userSponsored,
    userVerified,
    // fetching,
  } = brightIdVerificationInfo

  if (!userSponsored) {
    return (
      <div>
        <Tag background={theme.negativeSurface} color={theme.negative}>
          Not verified
        </Tag>
        <ButtonBase
          onClick={onVerify}
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
}

export default BrightIdStatus
