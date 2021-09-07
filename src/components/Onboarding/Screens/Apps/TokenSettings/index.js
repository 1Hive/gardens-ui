import React from 'react'
import TokenSettingsNative from './TokenSettingsNative'
import TokenSettingsBYOT from './TokenSettingsBYOT'
import { useOnboardingState } from '@providers/Onboarding'

import { NATIVE_TYPE, BYOT_TYPE } from '../../../constants'

function TokenSettings() {
  const { config } = useOnboardingState()
  return (
    <>
      {config.garden.type === NATIVE_TYPE && <TokenSettingsNative />}
      {config.garden.type === BYOT_TYPE && <TokenSettingsBYOT />}
    </>
  )
}

export default TokenSettings
