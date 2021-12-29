import { CSSProp } from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MyTheme {} // declare custom theme type

declare module 'react' {
  interface Attributes {
    css?: CSSProp<MyTheme>
  }
}
