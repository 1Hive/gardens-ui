declare module '@1hive/1hive-ui' {
  const Main: any
  const GU: any
  const useToast: any
  const useTheme: () => any // TODO: This shoudl include the Theme

  const Button: any
  const ButtonBase: any
  const IconMenu: any
  const useLayout: () => {
    layoutName: 'small' | 'medium' | 'large' | 'max'
  }
  const Link: any
  const useViewport: () => {
    below: any
  }
  const DataView: any
  const EthIdenticon: any
  const GU: number
  const RADIUS: number
  const shortenAddress: (account) => string
  const textStyle: (type) => string

  export {
    Main,
    GU,
    useToast,
    useTheme,
    Button,
    ButtonBase,
    IconMenu,
    useLayout,
    useViewport,
    Link,
    DataView,
    EthIdenticon,
    GU,
    RADIUS,
    shortenAddress,
    textStyle,
  }
}
