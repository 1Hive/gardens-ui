import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('@components/Garden/Home'))
const ProposalLoader = lazy(() => import('@components/Garden/ProposalLoader'))
const DecisionLoader = lazy(() => import('@components/Garden/DecisionLoader'))
const Agreement = lazy(() => import('@components/Garden/Agreement/Agreement'))
const StakeManagement = lazy(() =>
  import('@components/Garden/Stake/StakeManagement')
)

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
