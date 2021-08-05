import React from 'react'
import { useOnboardingState } from '../../../../providers/Onboarding'
import { NATIVE_TYPE, BYOT_TYPE } from '../../constants'
import TokensSettingsNative from './TokensSettingsNative'
import TokensSettingsBYOT from './TokensSettingsBYOT'

function TokensSettings() {
  const { config } = useOnboardingState()
  return (
    <>
      {config.garden.type === NATIVE_TYPE && <TokensSettingsNative />}
      {config.garden.type === BYOT_TYPE && <TokensSettingsBYOT />}
    </>
  )
}

export default TokensSettings
