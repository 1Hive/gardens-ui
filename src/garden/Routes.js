import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Agreement from '../components/Agreement/Agreement'
import DecisionLoader from '../components/DecisionLoader'
import Home from '../screens/Home'
import ProposalLoader from '../components/ProposalLoader'
import StakeManagement from '../components/Stake/StakeManagement'
import { useGardens } from '../providers/Gardens'

export default function Routes() {
  const { connectedGarden } = useGardens()
  const { address: daoAddress } = connectedGarden || {}

  return (
    <Switch>
      <Route exact path={`*/${daoAddress}/`} component={Home} />
      <Route exact path="*/proposal/:id" component={ProposalLoader} />
      <Route exact path="*/vote/:id" component={DecisionLoader} />
      <Route exact path="*/covenant" component={Agreement} />
      <Route exact path="*/collateral" component={StakeManagement} />
      {/* <Redirect to="/home" /> */}
    </Switch>
  )
}
