import React from 'react'
import { ButtonBase, GU, Tag, textStyle, useTheme } from '@1hive/1hive-ui'

function BrightIdStatus({ brightIdVerificationInfo, sponsorshipInfo }) {
  const theme = useTheme()
  const {
    addressExist,
    // addressUnique,
    // signature,
    // timestamp,
    // userAddresses,
    // userSponsored,
    userVerified,
    // fetching,
  } = brightIdVerificationInfo

  if (!userVerified && !addressExist) {
    return (
      <div>
        <Tag background={theme.negativeSurface} color={theme.negative}>
          Not verified
        </Tag>
        <ButtonBase
          onClick={() => window.alert('verify!')}
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
}

export default BrightIdStatus
