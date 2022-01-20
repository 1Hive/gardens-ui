import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { textStyle, useTheme, GU } from '@1hive/1hive-ui'

function Header({
  title,
  subtitle,
  thirdtitle,
  topSpacing = 3 * GU,
  bottomSpacing = 7 * GU,
}) {
  const theme = useTheme()

  useEffect(() => {
    const onboardingWizardHeaderEl = document.getElementById(
      'onboarding-wizard-header'
    )

    onboardingWizardHeaderEl.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    })
  }, [])

  return (
    <header
      css={`
        padding: ${topSpacing}px ${2 * GU}px ${bottomSpacing}px;
        text-align: center;
      `}
      id="onboarding-wizard-header"
    >
      <h1
        css={`
          font-size: 40px;
          font-weight: 600;
        `}
      >
        {title}
      </h1>
      {subtitle && (
        <div
          css={`
            ${textStyle('title3')};
            color: ${theme.contentSecondary};
            padding-top: ${1 * GU}px;
          `}
        >
          {subtitle}
        </div>
      )}
      {thirdtitle && (
        <div
          css={`
            ${textStyle('body2')};
            color: ${theme.contentSecondary};
            padding-top: ${2 * GU}px;
          `}
        >
          {thirdtitle}
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  thirdtitle: PropTypes.node,
  topSpacing: PropTypes.number.isRequired,
  bottomSpacing: PropTypes.number.isRequired,
}

Header.defaultProps = {
  topSpacing: 3 * GU,
  bottomSpacing: 7 * GU,
}

export default Header
