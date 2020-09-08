import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Feed from './screens/Feed'
import Profile from './screens/Profile'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/profile" component={Profile} />
      <Route path="/" component={Feed} />
    </Switch>
  )
}
