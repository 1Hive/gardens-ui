import { useEffect, useState } from 'react'
import {
  ConvictionVoting,
  // Proposal,
} from '@1hive/connect-thegraph-conviction-voting'
import { connect } from '@aragon/connect'
import { useWallet } from '../providers/Wallet'

const ORG_ADDRESS = '0x6a8b8891c5f6de1fcf1ab889e7a06f6b60431641'

const APP_DATA_SETTINGS = {
  organization: null,
  convictionApp: null,
}
export function useAppData() {
  const { ethereum } = useWallet()
  const [appData, setAppData] = useState(APP_DATA_SETTINGS)

  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      // Fetch the apps belonging to this organization. const apps = await org.apps()
      const org = await connect(
        ORG_ADDRESS,
        [
          'thegraph',
          {
            orgSubgraphUrl:
              'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai',
          },
        ],
        {
          readProvider: ethereum,
        }
      )

      const apps = await org.apps()

      const convictionApp = apps.find(app => app.name === 'conviction-voting')

      const conviction = new ConvictionVoting(
        convictionApp.address,
        'https://api.thegraph.com/subgraphs/name/1hive/aragon-conviction-voting-xdai'
      )

      if (!cancelled) {
        setAppData({ organization: org, convictionApp: conviction })
      }
    }
    fetchOrg()
    return () => {
      cancelled = true
    }
  }, [ethereum])

  return appData
}
