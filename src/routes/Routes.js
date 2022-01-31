import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { LoadingRing, Main } from '@1hive/1hive-ui'

const Home = lazy(() => import('@components/Home'))
const Garden = lazy(() => import('@components/Garden'))
const Profile = lazy(() => import('@components/Profile/Profile'))
const Identity = lazy(() => import('@components/Profile/Identity'))

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />

      <Suspense
        fallback={
          <Main>
            <LoadingRing />
          </Main>
        }
      >
        <Route path="/home" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/identity" component={Identity} />
        <Route path="/:networkType/garden/:gardenAddress" component={Garden} />
      </Suspense>

      <Redirect to="/home" />
    </Switch>
  )
}
