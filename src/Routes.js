import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import DecisionLoader from './components/DecisionLoader'
import Home from './screens/Home'
import Profile from './screens/Profile'
import ProposalDetail from './screens/ProposalDetail'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={Home} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/proposal/:id" component={ProposalDetail} />
      <Route exact path="/vote/:id" component={DecisionLoader} />
      <Redirect to="/home" />
    </Switch>
  )
}
