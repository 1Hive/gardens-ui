import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Garden from '@components/Garden'
import Home from '@components/Home'
import Onboarding from '@components/Onboarding'
import Profile from '@components/Profile/Profile'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={Home} />
      <Route path="/create" component={Onboarding} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/garden/:daoId" component={Garden} />
      <Redirect to="/home" />
    </Switch>
  )
}
