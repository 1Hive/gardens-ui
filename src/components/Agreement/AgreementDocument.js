import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  // Checkbox,
  // Field,
  Markdown,
  textStyle,
  useTheme,
  useLayout,
  GU,
} from '@1hive/1hive-ui'
import ModalButton from '../ModalFlows/ModalButton'
import { useMounted } from '../../hooks/useMounted'
import { useWallet } from '../../providers/Wallet'
// import { useMultiModal } from '../MultiModal/MultiModalProvider'
import { getIpfsCidFromUri, ipfsGet } from '../../utils/ipfs-utils'

function AgreementDocument({ ipfsUri, onSignAgreement }) {
  const [loading, setLoading] = useState(false)

  const mounted = useMounted()
  const { account } = useWallet()
  const { layoutName } = useLayout()
  const [markdownContent, setMarkdownContent] = useState('')
  const theme = useTheme()
  const compactMode = layoutName === 'small'

  useEffect(() => {
    // TODO: Add loading state if data size becomes large enough to be a problem
    async function getAgreementIpfsContent() {
      const { data, error } = await ipfsGet(getIpfsCidFromUri(ipfsUri))

      if (error && mounted()) {
        // Fail gracefully on error and render just the empty component
        setMarkdownContent('')

        return
      }

      if (mounted()) {
        setMarkdownContent(data)
      }
    }

    if (ipfsUri) {
      getAgreementIpfsContent()
    }
  }, [ipfsUri, mounted])

  const handleSign = useCallback(() => {
    setLoading(true)
    onSignAgreement()

    // Proceed to the next screen after transactions have been received
    // getTransactions(() => {
    //   next()
    // })
  }, [onSignAgreement])

  return (
    <Box
      padding={0}
      css={`
        padding: ${({ compact }) => `${compact ? 2 * GU : 7 * GU}px`};
      `}
    >
      <Article theme={theme} compact={compactMode}>
        <Markdown content={markdownContent} />
      </Article>
      <ModalButton
        mode="strong"
        loading={loading}
        onClick={handleSign}
        disabled={!account}
      >
        Sign Agreement
      </ModalButton>
    </Box>
  )
}

// function SignOverview({ onSignAgreement, getTransactions }) {
//   const [acceptedTerms, setAcceptedTerms] = useState(false)
//   const [loading, setLoading] = useState(false)
//   // const { next } = useMultiModal()

//   const handleSign = useCallback(() => {
//     setLoading(true)
//     onSignAgreement()

//     // Proceed to the next screen after transactions have been received
//     // getTransactions(() => {
//     //   next()
//     // })
//   }, [onSignAgreement])

//   const handleAcceptTerms = useCallback(
//     checked => setAcceptedTerms(checked),
//     []
//   )

//   return (
//     <>
//       <h2
//         css={`
//           ${textStyle('title4')};
//           margin-bottom: ${4 * GU}px;
//         `}
//       >
//         Sign Agreement
//       </h2>
//       <label
//         css={`
//           display: flex;
//           margin-bottom: ${3 * GU}px;
//         `}
//       >
//         <div
//           css={`
//             margin-left: -${0.5 * GU}px;
//             margin-right: ${1 * GU}px;
//           `}
//         >
//           <Checkbox checked={acceptedTerms} onChange={handleAcceptTerms} />
//         </div>
//         By signing this Agreement, you agree to 1Hive Network DAO manifesto, by
//         laws and community code of behavior.
//       </label>
//       <Field label="Agreement action collateral">
//         <p>
//           In order perform or challenge actions bound by this Agreement, you
//           must deposit some HNY as the action collateral first. Different apps
//           might require different tokens and amounts as the action collateral.
//         </p>
//       </Field>
//       <ModalButton
//         mode="strong"
//         loading={loading}
//         onClick={handleSign}
//         disabled={!acceptedTerms}
//       >
//         Sign Agreement
//       </ModalButton>
//     </>
//   )
// }

const Article = styled.article`
  h1 {
    text-align: center;
    margin-top: ${4 * GU}px;
    margin-bottom: ${1 * GU}px;

    ${textStyle('title2')};
  }

  h2 {
    ${textStyle('title4')};
  }

  h3 {
    ${textStyle('body1')};
  }

  h4 {
    ${textStyle('body2')};
  }

  h2,
  h3,
  h4 {
    margin-top: ${4 * GU}px;
    margin-bottom: ${1 * GU}px;

    font-weight: 600;
  }

  p,
  li {
    margin-top: ${1 * GU}px;
    margin-bottom: ${2.5 * GU}px;
  }

  ul,
  ol {
    padding: 0;
    margin: ${2 * GU}px ${3 * GU}px;
  }

  ul {
    list-style: none;

    li::before {
      content: '•';
      color: ${({ theme }) => theme.accent};
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  /* Trim margin top / bottom to sit flush against container */
  h1,
  h2,
  h4,
  h4,
  p,
  ol,
  ul {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`
// const LineSeparator = styled.div`
//   height: 1px;
//   border-bottom: 0.5px solid ${({ border }) => border};
//   margin: ${3 * GU}px 0;
// `

export default AgreementDocument
