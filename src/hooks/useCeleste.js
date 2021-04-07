import { useEffect, useMemo, useState } from 'react'

import gql from 'graphql-tag'
import { Client } from 'urql'
import { getNetwork } from '../networks'

const RETRY_EVERY = 3000

const graphqlClient = new Client({ url: getNetwork().subgraphs.celeste })

const COURT_CONFIG_QUERY = gql`
  query CourtConfig($id: ID!) {
    courtConfig(id: $id) {
      id
      currentTerm
      termDuration

      terms {
        id
        startTime
      }
    }
  }
`

function useCelesteConfigPoll() {
  const [config, setConfig] = useState(null)
  const arbitratorAddress = getNetwork().arbitrator

  useEffect(() => {
    let cancelled = false

    if (!arbitratorAddress) {
      return
    }
    async function fetchConfig() {
      try {
        const result = await graphqlClient
          .query(COURT_CONFIG_QUERY, { id: arbitratorAddress.toLowerCase() })
          .toPromise()
        if (!result?.data) {
          return
        }

        const { courtConfig } = result.data

        if (!cancelled) {
          setConfig(courtConfig)
        }
      } catch (err) {
        console.error(`Error fetching celeste config ${err}, retrying...`)
      }

      if (!cancelled) {
        setTimeout(fetchConfig, RETRY_EVERY)
      }
    }

    fetchConfig()

    return () => {
      cancelled = true
    }
  }, [arbitratorAddress])

  return config
}

export function useCelesteSynced() {
  const config = useCelesteConfigPoll()

  return useMemo(() => {
    if (!config || config.terms.length === 0) {
      return [!config, false]
    }

    const { currentTerm, termDuration, terms } = config

    const nowS = Date.now() / 1000
    const expectedCurrentTerm = getExpectedCurrentTermId(nowS, {
      terms,
      termDuration,
    })

    return [parseInt(expectedCurrentTerm) === parseInt(currentTerm), false]
  }, [config])
}

function getExpectedCurrentTermId(now, { terms, termDuration }) {
  const firstTermStartTime = terms[0].startTime
  return Math.floor((now - firstTermStartTime) / termDuration)
}
