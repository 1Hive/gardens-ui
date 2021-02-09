// import React, { useState, useCallback, useMemo } from 'react'
// import PropTypes from 'prop-types'
// import {
//   TextInput,
//   formatTokenAmount,
//   Field,
//   TokenAmount,
//   textStyle,
//   useTheme,
//   GU,
// } from '@1hive/1hive-ui'
// import InfoField from '../../InfoField'
// import ModalButton from '../ModalButton'
// import { useActions } from '../../../hooks/useActions'
// import { useMultiModal } from '../../MultiModal/MultiModalProvider'
// import { useSingleVote } from '../../../hooks/useSingleVote'
// import HelpTip from '../../HelpTip'

// function ChallengeRequirements({ handleSetTransactions }) {
//   const theme = useTheme()
//   const { challengeProposal } = useActions()
//   const [{ collateral, actionId }] = useSingleVote()
//   const { settlementPeriodHours, token, challengeAmount } = collateral

//   const [argument, setArgument] = useState('')
//   const [loading, setLoading] = useState(false)
//   const { next } = useMultiModal()

//   const maxChallengeAmount = useMemo(
//     () => formatTokenAmount(challengeAmount, token.decimals),
//     [challengeAmount, token.decimals]
//   )

//   const [settlementAmount, setSettlementAmount] = useState(maxChallengeAmount)

//   const handleChallengeAction = useCallback(
//     async (onComplete) => {
//       await challengeProposal(
//         {
//           actionId: actionId,
//           settlementOffer: settlementAmount,
//           finishedEvidence: true,
//           context: '',
//         },
//         (intent) => {
//           // Pass transactions array back to parent component
//           handleSetTransactions(intent.transactions)
//           onComplete()
//         }
//       )
//     },
//     [handleSetTransactions, actionId, challengeProposal, settlementAmount]
//   )

//   const handleSubmit = useCallback(
//     (event) => {
//       event.preventDefault()

//       setLoading(true)

//       // Proceed to the next screen after transactions have been received
//       handleChallengeAction(next)
//     },
//     [handleChallengeAction, next]
//   )

//   const handleArgumentChange = useCallback(({ target }) => {
//     setArgument(target.value)
//   }, [])

//   const handleSettlementChange = useCallback(({ target }) => {
//     setSettlementAmount(target.value)
//   }, [])

//   return (
//     <form onSubmit={handleSubmit}>
//       <InfoField
//         label={
//           <>
//             Settlement Period
//             <HelpTip type="settlement-period" />
//           </>
//         }
//         css={`
//           margin-top: ${1 * GU}px;
//           margin-bottom: ${3.5 * GU}px;
//         `}
//       >
//         <p>
//           {settlementPeriodHours}{' '}
//           <span
//             css={`
//               color: ${theme.surfaceContentSecondary};
//             `}
//           >
//             Hours
//           </span>
//         </p>
//       </InfoField>

//       <Field
//         label={
//           <>
//             Settlement Offer
//             <HelpTip type="settlement-offer" />
//           </>
//         }
//         css={`
//           margin-bottom: ${3.5 * GU}px;
//         `}
//       >
//         <TextInput
//           value={settlementAmount}
//           min="0"
//           max={maxChallengeAmount}
//           type="number"
//           wide
//           onChange={handleSettlementChange}
//           adornment={
//             <TokenAmount
//               address={token.id}
//               symbol={token.symbol}
//               css={`
//                 padding: ${0.5 * GU}px;
//                 padding-right: ${1 * GU}px;
//                 background-color: ${theme.surface};
//               `}
//             />
//           }
//           adornmentPosition="end"
//           adornmentSettings={{ padding: 0.5 * GU }}
//           required
//         />
//         <p
//           css={`
//             margin-top: ${1 * GU}px;
//             color: ${theme.surfaceContentSecondary};
//             ${textStyle('body3')};
//           `}
//         >
//           This amount cannot be greater than the stake locked for the action
//           submmission: {maxChallengeAmount} {token.symbol}.
//         </p>
//       </Field>

//       <Field
//         label="Argument in favour of cancelling action"
//         css={`
//           margin-bottom: 0px;
//         `}
//       >
//         <TextInput
//           multiline
//           value={argument}
//           wide
//           onChange={handleArgumentChange}
//           required
//           css={`
//             min-height: ${15 * GU}px;
//           `}
//         />
//       </Field>
//       <ModalButton mode="strong" type="submit" loading={loading}>
//         Create transaction
//       </ModalButton>
//     </form>
//   )
// }

// ChallengeRequirements.propTypes = {
//   handleSetTransactions: PropTypes.func.isRequired,
// }

// export default ChallengeRequirements
