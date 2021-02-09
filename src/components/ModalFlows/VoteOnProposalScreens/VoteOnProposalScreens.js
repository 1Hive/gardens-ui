import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import { useActions } from '../../../hooks/useActions'

function VoteOnProposalScreens({ voteId, voteSupported }) {
  const { voteOnProposal } = useActions()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const transactionTitle = `Vote ${
    voteSupported ? 'yes' : 'no'
  } on vote #${voteId}`

  useEffect(() => {
    async function getTransactions() {
      await voteOnProposal({ voteId, voteSupported }, (intent) => {
        setTransactions(intent.transactions)
        setLoading(false)
      })
    }

    getTransactions()
  }, [voteId, voteSupported, voteOnProposal])

  return (
    <ModalFlowBase
      loading={loading}
      transactions={transactions}
      transactionTitle={transactionTitle}
    />
  )
}

VoteOnProposalScreens.propTypes = {
  voteId: PropTypes.string,
  voteSupported: PropTypes.bool,
}

export default VoteOnProposalScreens
