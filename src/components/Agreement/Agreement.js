import React from 'react'
import { Header } from '@1hive/1hive-ui'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import AgreementHeader from './AgreementHeader'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import { useAgreement } from '../../hooks/useAgreement'

import Loader from '../Loader'

function Agreement() {
  const [agreement, loading] = useAgreement()

  const signed = agreement.signed

  if (loading) {
    return <Loader />
  }

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Agreement" />
        <AgreementLayout agreement={agreement} signedAgreement={signed} />
      </LayoutLimiter>
    </LayoutGutter>
  )
}

function AgreementLayout({ agreement, signedAgreement }) {
  const {
    title,
    contractAddress,
    contentIpfsUri,
    disputableAppsWithRequirements,
    effectiveFrom,
    stakingAddress,
  } = agreement

  return (
    <LayoutColumns
      primary={
        <>
          <LayoutBox primary>
            <AgreementHeader title={title} />
            <AgreementDetails
              contractAddress={contractAddress}
              creationDate={effectiveFrom}
              ipfsUri={contentIpfsUri}
              stakingAddress={stakingAddress}
              signedAgreement={signedAgreement}
            />
          </LayoutBox>
          <AgreementDocument ipfsUri={contentIpfsUri} />
        </>
      }
      secondary={
        <AgreementBindingActions apps={disputableAppsWithRequirements} />
      }
    />
  )
}

export default Agreement
