import { useRouter } from 'next/router'

export function useGardenRoute() {
  const router = useRouter()
  const { gardenAddress, networkType } = router.query || {}

  return [networkType, gardenAddress]
}
