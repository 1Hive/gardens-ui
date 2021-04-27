import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import GardenHome from './garden/home'
import GardensDashboard from './GardensDashboard'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={GardensDashboard} />
      <Route path="/:daoId" component={GardenHome} />
    </Switch>
  )
}
