// import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import ModalFlowBase from '../ModalFlowBase'
// import { useActions } from '../../../hooks/useActions'

// function SettleProposalScreens({ actionId }) {
//   const { settleDispute } = useActions()
//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function getTransactions() {
//       await settleDispute({ actionId }, (intent) => {
//         setTransactions(intent.transactions)
//         setLoading(false)
//       })
//     }

//     getTransactions()
//   }, [actionId, settleDispute])

//   return (
//     <ModalFlowBase
//       loading={loading}
//       transactions={transactions}
//       transactionTitle="Accept settlement"
//     />
//   )
// }

// SettleProposalScreens.propTypes = {
//   actionId: PropTypes.string,
// }

// export default SettleProposalScreens
