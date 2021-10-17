import React, { useCallback, useState } from 'react'
import { GU, IconInfo, useTheme } from '@1hive/1hive-ui'
import WelcomeModal from './WelcomeModal'

function WelcomeLoader() {
  const theme = useTheme()
  const [welcomeClosed, setWelcomeClosed] = useState(
    localStorage.getItem('welcomeClosed') === 'true'
  )

  const handleOnOpen = useCallback(() => {
    setWelcomeClosed(false)
  }, [])

  const handleOnClose = useCallback(() => {
    localStorage.setItem('welcomeClosed', 'true')
    setWelcomeClosed(true)
  }, [])

  return (
    <React.Fragment>
      <WelcomeModal onClose={handleOnClose} visible={!welcomeClosed} />
      <div
        onClick={handleOnOpen}
        css={`
          display: flex;
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 2;
          margin: ${2 * GU}px;
          padding: ${1 * GU}px;
          background: ${theme.surface};
          box-shadow: 0 1px 4px 0 rgb(0 0 0 / 6%), 0 2px 12px 0 rgb(0 0 0 / 16%);
          border: 1px solid ${theme.border};
          border-radius: 50%;
          cursor: pointer;

          &:hover {
            background: ${theme.background};
          }
        `}
      >
        <IconInfo size="large" color="#185629" />
      </div>
    </React.Fragment>
  )
}

export default WelcomeLoader
