import React from 'react'

import useActions from '@hooks/useActions'
import CreateDecisionVoteScreens from './CreateDecisionVoteScreens'

function SetConvictionSettingsScreens({ onComplete, params }) {
  const { convictionActions } = useActions()

  return (
    <CreateDecisionVoteScreens
      actions={convictionActions}
      fn="setStableTokenOracleSettings"
      params={params}
      onComplete={onComplete}
    />
  )
}

export default SetConvictionSettingsScreens
