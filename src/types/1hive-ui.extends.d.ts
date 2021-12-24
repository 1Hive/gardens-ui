import { ReactNode } from 'react'

import '@1hive/1hive-ui'

declare module '@1hive/1hive-ui' {
  export declare function Box({
    heading,
    children,
    padding,
    ...props
  }: {
    [x: string]: any
    heading?: ReactNode
    children?: ReactNode
    padding?: number
  }): JSX.Element
}
