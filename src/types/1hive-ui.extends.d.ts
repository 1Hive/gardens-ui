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

  //
  //
  // Remove those below after publish new version d.ts types 1hive-ui with the same
  //
  //
  export declare function Modal({
    children,
    onClose,
    onClosed,
    padding,
    visible,
    width,
    closeButton,
    ...props
  }: {
    [x: string]: any
    children?: any
    onClose?: () => void
    onClosed?: () => void
    padding?: any
    visible?: any
    width?: any
    closeButton?: any
  }): JSX.Element

  export declare function Link({
    onClick,
    href,
    external,
    ...props
  }: {
    [x: string]: any
    onClick?: () => void
    href?: any
    external?: any
  }): JSX.Element

  export declare function IconMenu({
    size,
    ...props
  }: {
    [x: string]: any
    size?: any
  }): JSX.Element

  type LayoutType = {
    layoutName: 'small' | 'medium' | 'large' | 'max'
    layoutWidth: string
  }
  export declare function useLayout(): LayoutType
}
