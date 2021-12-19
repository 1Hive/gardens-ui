import React from 'react'

import { useOnboardingState } from '@providers/Onboarding'

import { BYOT_TYPE, NATIVE_TYPE } from '../../../constants'
import TokenSettingsBYOT from './TokenSettingsBYOT'
import TokenSettingsNative from './TokenSettingsNative'

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
