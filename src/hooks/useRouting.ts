import { useRouteMatch } from 'react-router'

type ParamsType = {
  params: {
    gardenAddress: string
    networkType: string
  }
} | null

export function useGardenRoute() {
  const match: ParamsType = useRouteMatch('/:networkType/garden/:gardenAddress')
  const { gardenAddress, networkType } = match?.params || {}

  return [networkType, gardenAddress]
}
