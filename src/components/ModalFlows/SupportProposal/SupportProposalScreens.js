import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import SupportProposal from './SupportProposal'
import useActions from '../../../hooks/useActions'

function SupportProposalScreens({ versionId, id, onDone, stakeProposal }) {
  const actions = useActions()
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async onComplete => {
      await actions.agreementActions.signAgreement({ versionId }, intent => {
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [actions, versionId]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Support this proposal',
        graphicHeader: false,
        content: (
          <SupportProposal
            id={id}
            getTransactions={getTransactions}
            onDone={onDone}
            onStakeProposal={stakeProposal}
          />
        ),
      },
    ],
    [getTransactions]
  )
  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Support this proposal"
      screens={screens}
    />
  )
}

SupportProposalScreens.propTypes = {
  versionId: PropTypes.string,
}

export default SupportProposalScreens
