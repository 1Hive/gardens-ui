import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Agreement from '@components/Garden/Agreement/Agreement'
import DecisionLoader from '@components/Garden/DecisionLoader'
import Home from '@components/Garden/Home'
import ProposalLoader from '@components/Garden/ProposalLoader'
import StakeManagement from '@components/Garden/Stake/StakeManagement'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="*/proposal/:id" component={ProposalLoader} />
      <Route exact path="*/vote/:id" component={DecisionLoader} />
      <Route exact path="*/covenant" component={Agreement} />
      <Route exact path="*/collateral*" component={StakeManagement} />
      <Route path="*/" component={Home} />
    </Switch>
  )
}
