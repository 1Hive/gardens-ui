declare module '@1hive/1hive-ui' {
  const Main: any
  const GU: any
  const useToast: any
  const useTheme: any
  const Button: any
  const useLayout: () => {
    layoutName: "small" | "medium" | "large" | "max"
  }
  const Link: any
  const useViewport: () => {
    below: any
  }
  export { Main, GU, useToast, useTheme, Button, useLayout, useViewport, Link }
}