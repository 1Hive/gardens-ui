import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Agreement from '../components/Agreement/Agreement'
import DecisionLoader from '../components/DecisionLoader'
import Home from '../screens/Home'
import Profile from '../screens/Profile'
import ProposalLoader from '../components/ProposalLoader'
import StakeManagement from '../components/Stake/StakeManagement'
import { useDAO } from '../providers/Dao'

export default function Routes() {
  const dao = useDAO()
  const { address: daoAddress } = dao || {}

  return (
    <Switch>
      <Redirect exact from={`*/${daoAddress}/`} to={`${daoAddress}/home`} />
      <Route path="*/home" component={Home} />
      <Route exact path="*/profile" component={Profile} />
      <Route exact path="*/proposal/:id" component={ProposalLoader} />
      <Route exact path="*/vote/:id" component={DecisionLoader} />
      <Route exact path="*/covenant" component={Agreement} />
      <Route exact path="*/collateral" component={StakeManagement} />
      {/* <Redirect to="/home" /> */}
    </Switch>
  )
}
