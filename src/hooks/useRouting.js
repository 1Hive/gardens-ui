import { useRouteMatch } from 'react-router'

export function useGardenRoute() {
  const match = useRouteMatch('/:networkType/garden/:gardenAddress')
  const { gardenAddress, networkType } = match?.params || {}

  return [networkType, gardenAddress]
}
