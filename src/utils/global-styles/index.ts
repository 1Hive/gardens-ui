import { createGlobalStyle } from 'styled-components'

const DEFAULT_FONT_FAMILY = 'aragon-ui'
const MONOSPACE_FONT_FAMILY = 'aragon-ui-monospace'

type FontFamily = {
  url: string
  format: string
}

type FontFamilyUrlParams = Record<string, FontFamily>

const DEFAULT_FONTS: FontFamilyUrlParams = {
  '400': {
    format: 'woff2',
    url: '/fonts/overpass/overpass-light.woff2',
  },
  '600': {
    format: 'woff2',
    url: '/fonts/overpass/overpass-regular.woff2',
  },
  '800': {
    format: 'woff2',
    url: '/fonts/overpass/overpass-semibold.woff2',
  },
}

const MONOSPACE_FONTS = {
  '400': {
    format: 'woff2',
    url: '/fonts/overpass-mono/overpass-mono-light.woff2',
  },
}

const fontSrc = ({ url, format }: FontFamily) =>
  `url(${url}) format('${format}')`

export const GlobalFontStyles = createGlobalStyle`
  @font-face {
    font-family: ${DEFAULT_FONT_FAMILY};
    src: ${fontSrc(DEFAULT_FONTS['400'])};
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: ${DEFAULT_FONT_FAMILY};
    src: ${fontSrc(DEFAULT_FONTS['600'])};
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: ${DEFAULT_FONT_FAMILY};
    src: ${fontSrc(DEFAULT_FONTS['800'])};
    font-weight: 800;
    font-style: normal;
  }
  @font-face {
    font-family: ${MONOSPACE_FONT_FAMILY};
    src: ${fontSrc(MONOSPACE_FONTS['400'])};
    font-weight: 400;
    font-style: normal;
  }
`
