import { Garden } from '@1hive/connect-gardens'

declare module '@1hive/connect-gardens' {
  declare type Config = {
    pollInterval?: number
    subgraphUrl: string
  }

  export default function connectGarden(
    organization: any,
    config?: Config
  ): Garden
  export {}
}
