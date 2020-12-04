import React from 'react'
import { Header, useLayout } from '@1hive/1hive-ui'
import { useAgreement } from '../../hooks/useAgreement'

import Loader from '../Loader'

function Agreement() {
  const { layoutName } = useLayout()
  const [agreement, loading] = useAgreement()

  console.log(agreement, loading)
  const paddingAmount = layoutName === 'small' ? `0px` : '5%'

  return (
    <div
      css={`
        padding-left: ${paddingAmount};
        padding-right: ${paddingAmount};
      `}
    >
      <div
        css={`
          margin-left: auto;
          margin-right: auto;
          max-width: 1280px;
        `}
      >
        <Header primary="Agreement" />
        <Loader />
      </div>
    </div>
  )
}

export default Agreement
