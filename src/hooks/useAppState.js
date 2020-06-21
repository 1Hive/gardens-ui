// import {
//   ConvictionVoting,
//   // Proposal,
// } from '@1hive/connect-thegraph-conviction-voting'
// import { useEffect } from 'react'
// import { useOrg } from './useAppData'

// export function useAppState() {
//   const org = useOrg()

//   useEffect(() => {
//     if (!org) {
//       return
//     }
//     const fetchAppData = async () => {
//       const cancelled = false

//       // Fetch the apps belonging to this organization. const apps = await org.apps()

//       const apps = await org.apps()

//       const convictionApp = apps.find(app => app.name === 'conviction-voting')

//       const conviction = new ConvictionVoting(
//         convictionApp.address,
//         'https://api.thegraph.com/subgraphs/name/1hive/aragon-conviction-voting-xdai'
//       )

//       const proposals = await conviction.proposals()

//       if (!cancelled) {
//         console.log('ORG ', org)
//         console.log('apps  ', apps)
//         console.log('proposals ', proposals)
//       }
//     }
//     fetchAppData()
//   }, [org])
// }
