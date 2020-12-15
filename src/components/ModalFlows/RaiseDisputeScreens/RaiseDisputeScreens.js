// import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import ModalFlowBase from '../ModalFlowBase'
// import { useActions } from '../../../hooks/useActions'

// function RaiseDisputeScreens({ actionId }) {
//   const { raiseDispute } = useActions()
//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function getTransactions() {
//       // TODO: Replace happy path defaults
//       await raiseDispute({ actionId, finishedEvidence: true }, (intent) => {
//         setTransactions(intent.transactions)
//         setLoading(false)
//       })
//     }

//     getTransactions()
//   }, [actionId, raiseDispute])

//   return (
//     <ModalFlowBase
//       loading={loading}
//       transactions={transactions}
//       transactionTitle="Raise to Aragon Court"
//     />
//   )
// }

// RaiseDisputeScreens.propTypes = {
//   actionId: PropTypes.string,
// }

// export default RaiseDisputeScreens
