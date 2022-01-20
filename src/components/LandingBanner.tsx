import React from 'react'
import { Button, GU, useLayout, useTheme } from '@1hive/1hive-ui'
import desktopBanner from '@assets/landingBanner.png'
import mobileBanner from '@assets/landingBanner-mobile.png'
import tabletBanner from '@assets/landingBanner-tablet.png'
import styled from 'styled-components'

const BANNERS = {
  small: {
    aspectRatio: '53.5%',
    hFontSize: '32px',
    image: mobileBanner,
    pFontSize: '14px',
  },
  medium: {
    image: tabletBanner,
    aspectRatio: '36.5%',
    hFontSize: '52px',
    pFontSize: '18px',
  },
  large: {
    image: desktopBanner,
    aspectRatio: '26.5%',
    hFontSize: '52px',
    pFontSize: '18px',
  },
  max: {
    image: desktopBanner,
    aspectRatio: '26.5%',
    hFontSize: '64px',
    pFontSize: '20px',
  },
}

const Wrapper = styled.div<{
  image: string
  aspectRatio: any
}>`
  background: url(${(props) => props.image}) no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: ${(props) => props.aspectRatio};
`

const Container = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
`

const ContainerChild = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  text-align: center;
`

const Title = styled.h1<{
  hFontSize: string
}>`
  font-size: ${(props) => props.hFontSize};
  font-weight: bold;
  color: #048333;
`

const Subtitle = styled.p<{
  pFontSize: string
  color: any
}>`
  font-size: ${(props) => props.pFontSize};
  color: ${(props) => props.color};
`

type PropsType = {
  onCreateGarden: () => void
}

const LandingBanner = React.forwardRef<any, PropsType>((props, ref) => {
  const { onCreateGarden } = props
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { aspectRatio, hFontSize, image, pFontSize } = BANNERS[layoutName]

  return (
    <Wrapper ref={ref} image={image} aspectRatio={aspectRatio}>
      <Container>
        <ContainerChild>
          <div
            style={{
              width: 'min(650px, calc(100% - 150px))',
            }}
          >
            <div style={{ marginBottom: '7%' }}>
              <Title hFontSize={hFontSize}>Find your garden</Title>
              <Subtitle pFontSize={pFontSize} color={theme.contentSecondary}>
                Gardens are digital economies that anyone can help shape
              </Subtitle>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                label="Documentation"
                href="https://1hive.gitbook.io/gardens/"
                target="_blank"
                wide
                css={`
                  margin-right: ${2 * GU}px;
                `}
              />
              <Button
                label="Create a Garden"
                mode="strong"
                onClick={onCreateGarden}
                wide
              />
            </div>
          </div>
        </ContainerChild>
      </Container>
    </Wrapper>
  )
})

LandingBanner.displayName = 'LandingBanner'

export default LandingBanner
