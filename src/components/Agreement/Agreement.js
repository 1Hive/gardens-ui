import React, { useState } from 'react'
import { GU, Header, Info } from '@1hive/1hive-ui'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import AgreementHeader from './AgreementHeader'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import MultiModal from '../MultiModal/MultiModal'
import SignAgreementScreens from '../ModalFlows/SignAgreementScreens/SignAgreementScreens'
import { useAgreement } from '../../hooks/useAgreement'
import { useWallet } from '../../providers/Wallet'

import Loader from '../Loader'

import warningSvg from '../../assets/warning.svg'

function Agreement() {
  const [agreement, loading] = useAgreement()
  const [signModalVisible, setSignModalVisible] = useState(false)

  const signed = agreement.signedLatest

  if (loading) {
    return <Loader />
  }

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Agreement" />
        <AgreementLayout
          agreement={agreement}
          signedAgreement={signed}
          onSignAgreement={() => setSignModalVisible(true)}
        />
      </LayoutLimiter>
      <MultiModal
        visible={signModalVisible}
        onClose={() => setSignModalVisible(false)}
      >
        <SignAgreementScreens versionId={agreement.versionId} />
      </MultiModal>
    </LayoutGutter>
  )
}

function AgreementLayout({ agreement, signedAgreement, onSignAgreement }) {
  const { account } = useWallet()
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
          {account && !signedAgreement && (
            <Info
              mode="warning"
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              <div
                css={`
                  display: flex;
                `}
              >
                <img
                  src={warningSvg}
                  css={`
                    margin-right: ${0.5 * GU}px;
                  `}
                  alt=""
                />
                <span>You have not signed the Agreement.</span>
              </div>
            </Info>
          )}
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
          <AgreementDocument
            ipfsUri={contentIpfsUri}
            onSignAgreement={onSignAgreement}
            signedAgreement={signedAgreement}
          />
        </>
      }
      secondary={
        <AgreementBindingActions apps={disputableAppsWithRequirements} />
      }
    />
  )
}

export default Agreement
