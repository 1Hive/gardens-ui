import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import GardensDashboard from '@components/GardensDashboard'
import GardenHome from './garden/Home'
import Profile from '@components/Profile/Profile'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={GardensDashboard} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/garden/:daoId" component={GardenHome} />
      <Redirect to="/home" />
    </Switch>
  )
}
