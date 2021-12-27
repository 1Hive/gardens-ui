import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { LoadingRing, Main } from '@1hive/1hive-ui'

// import Garden from '@components/Garden'
// import Home from '@components/Home'
// import Profile from '@components/Profile/Profile'

const Home = lazy(() => import('@components/Home'))
const Garden = lazy(() => import('@components/Garden'))
const Profile = lazy(() => import('@components/Profile/Profile'))

export default function Routes() {
  return (
    <Switch>
      <Suspense
        fallback={
          <Main>
            <LoadingRing />
          </Main>
        }
      >
        <Redirect exact from="/" to="/home" />
        <Route path="/home" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route path="/:networkType/garden/:gardenAddress" component={Garden} />
        <Redirect to="/home" />
      </Suspense>
    </Switch>
  )
}
