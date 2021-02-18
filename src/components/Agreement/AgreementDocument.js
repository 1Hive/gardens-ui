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
import { getIpfsCidFromUri, ipfsGet } from '../../utils/ipfs-utils'

function AgreementDocument({ ipfsUri, onSignAgreement, signedAgreement }) {
  const [loading, setLoading] = useState(false)

  const mounted = useMounted()

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
        disabled={signedAgreement}
      >
        Sign Agreement
      </ModalButton>
    </Box>
  )
}

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
