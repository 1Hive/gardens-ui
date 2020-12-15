// import React, { useState, useMemo, useCallback } from 'react'
// import ModalFlowBase from '../ModalFlowBase'
// import ChallengeRequirements from './ChallengeRequirements'

// function ChallengeProposalScreens() {
//   const [transactions, setTransactions] = useState([])

//   const handleSetTransactions = useCallback((transactions) => {
//     setTransactions(transactions)
//   }, [])

//   const screens = useMemo(
//     () => [
//       {
//         title: 'Challenge action requirements',
//         content: (
//           <ChallengeRequirements
//             handleSetTransactions={handleSetTransactions}
//           />
//         ),
//       },
//     ],
//     [handleSetTransactions]
//   )

//   return (
//     <ModalFlowBase
//       frontLoad={false}
//       transactions={transactions}
//       transactionTitle="Challenge proposal"
//       screens={screens}
//     />
//   )
// }

// export default ChallengeProposalScreens
