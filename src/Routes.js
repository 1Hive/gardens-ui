import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import Profile from './screens/Profile'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <Route path="/dashboard" component={Dashboard} />
      <Route exact path="/profile" component={Profile} />
      <Redirect to="/dashboard" />
    </Switch>
  )
}
