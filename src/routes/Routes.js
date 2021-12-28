import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Garden from '@components/Garden'
import Profile from '@components/Profile/Profile'

const M5_GARDEN = '0x793a4c7ffaabcba9529e0dddb8a49884838c6d20'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to={`/mumbai/garden/${M5_GARDEN}`} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/:networkType/garden/:gardenAddress" component={Garden} />
      <Redirect to={`/mumbai/garden/${M5_GARDEN}`} />
    </Switch>
  )
}
