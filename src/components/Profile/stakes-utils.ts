import BigNumber from '@lib/bigNumber'
import { stakesPercentages } from '@utils/math-utils'

const DISTRIBUTION_ITEMS_MAX = 6

type StakeItem = {
  amount?: any
  gardenId: string | null
  proposalId: string | null
  proposalName: string
}

type TransformedStakeType = {
  item: StakeItem
  percentage?: any
} | null

type StakingTokensProps = {
  myStakes: Array<StakeItem>
}

type Garden = {
  address: string
  name: string
}

type StakeItemProps = {
  compact: any
  proposal: StakeItem
}

type StakePerGarden = {
  garden: string
  gardenName: string
  items: Array<StakeItem>
}

// get stakes per garden
const getStakeItemsPerGarden = (stakes: Array<StakeItem>, garden: string) => {
  const items: Array<any> = []

  stakes?.map((stake) => {
    if (stake?.gardenId === garden) {
      items.push(stake)
    }
  })

  return items
}

const getGardenNameByGardens = (
  gardens: Array<Garden>,
  gardenAddress: string
) => {
  const garden = gardens.find(
    (garden: Garden) => garden.address.toLowerCase() === gardenAddress
  )

  return garden?.name ?? ''
}

const getStakesByGarden = (
  gardensMetadata: Array<Garden>,
  stakes: Array<StakeItem>
) => {
  if (stakes === null) return []

  const gardens: Array<any> = []
  const stakesPerGarden: Array<any> = []

  // get all unique gardens
  stakes.map((stake: StakeItem) => {
    const gardenId = stake?.gardenId
    if (gardenId && !gardens.includes(gardenId)) {
      gardens.push(gardenId)
    }
  })

  gardens.map((garden: string) => {
    stakesPerGarden.push({
      garden,
      gardenName: getGardenNameByGardens(gardensMetadata, garden),
      items: getStakeItemsPerGarden(stakes, garden),
    })
  })

  return stakesPerGarden
}

const getTotalPerGarden = (stakes: Array<StakeItem>) => {
  if (!stakes) {
    return new BigNumber('0')
  }

  return stakes.reduce((accumulator, stake) => {
    return accumulator.plus(stake.amount)
  }, new BigNumber('0'))
}

const getMyStakesPerGarden = (
  gardensMetadata: Array<Garden>,
  stakes: Array<StakeItem>
) => {
  if (stakes === null) return []

  const newStakes: Array<{
    garden: string
    gardenName: string
    items: Array<TransformedStakeType>
  }> = []

  const stakesPerGarden: Array<StakePerGarden> = getStakesByGarden(
    gardensMetadata,
    stakes
  )

  stakesPerGarden.map((garden) => {
    const stakePercentagePerGarden = stakesPercentages(
      garden.items.map(({ amount }) => amount),
      {
        total: getTotalPerGarden(garden.items),
        maxIncluded: DISTRIBUTION_ITEMS_MAX,
      }
    )

    newStakes.push({
      garden: garden.garden,
      gardenName: garden.gardenName,
      items: stakePercentagePerGarden.map((stakePercentage: any) => {
        const item = garden.items[stakePercentage?.index]

        return {
          item: { ...item },
          percentage: parseFloat(stakePercentage.percentage),
        }
      }),
    })
  })

  return newStakes
}

export type { StakeItem, StakingTokensProps, Garden, StakeItemProps }

export { getMyStakesPerGarden }
