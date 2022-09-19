import BigNumber from '@lib/bigNumber'
import { stakesPercentages } from '@utils/math-utils'

const DISTRIBUTION_ITEMS_MAX_ACTIVE = 6
const DISTRIBUTION_ITEMS_MAX_INACTIVE = 6

type StakeItem = {
  amount?: any
  gardenId: string | null
  proposalId: string | null
  proposalName: string
  status?: 'ACTIVE' | 'INACTIVE'
}

type InactiveStakeType = {
  amount?: any
  createdAt: number
  id: string
  proposal: {
    id: string
    metadata: string
    name: string
    number: string
    organization: {
      id: string
    }
    status: string
    type: string
  }
}

type TransformedStakeType = {
  item: StakeItem
  percentage?: any
} | null

type StakingTokensProps = {
  myStakes: Array<StakeItem>
  myInactiveStakes: Array<any>
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

const refactorInactiveStakes = (
  stakes: Array<InactiveStakeType>
): Array<StakeItem> => {
  const items: Array<any> = []

  stakes.map((stake) => {
    items.push({
      amount: stake.amount,
      gardenId: stake.proposal.organization.id,
      proposalId: stake.proposal.id,
      proposalName: stake.proposal.name,
    })
  })

  return items
}

// get stakes per garden
const getStakeItemsPerGarden =
  (stakes: Array<StakeItem>, inactiveStakes: Array<StakeItem>) =>
  (garden: string) => {
    const items: Array<any> = []

    // add all items from active stakes for this garden
    stakes?.map((stake) => {
      if (stake?.gardenId === garden) {
        items.push({ ...stake, status: 'ACTIVE' })
      }
    })

    // add all items from inactive stakes for this garden
    inactiveStakes?.map((stake) => {
      if (stake?.gardenId === garden) {
        items.push({ ...stake, status: 'INACTIVE' })
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

const getStakesByGarden =
  (stakes: Array<StakeItem>, inactiveStakes: Array<StakeItem>) =>
  (gardensMetadata: Array<Garden>) => {
    if (stakes === null) return []

    const gardens: Array<any> = []
    const stakesPerGarden: Array<any> = []

    // get all unique gardens from stakes array
    stakes.map((stake: StakeItem) => {
      const gardenId = stake?.gardenId
      if (gardenId && !gardens.includes(gardenId)) {
        gardens.push(gardenId)
      }
    })

    // get all unique gardens from inactive stakes
    inactiveStakes.map((stake: StakeItem) => {
      const gardenId = stake?.gardenId
      if (gardenId && !gardens.includes(gardenId)) {
        gardens.push(gardenId)
      }
    })

    gardens.map((garden: string) => {
      stakesPerGarden.push({
        garden,
        gardenName: getGardenNameByGardens(gardensMetadata, garden),
        items: getStakeItemsPerGarden(stakes, inactiveStakes)(garden),
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

const getMyStakesPerGarden =
  (stakes: Array<StakeItem>, inactiveStakes: Array<any>) =>
  (gardensMetadata: Array<Garden>) => {
    if (stakes === null) return []

    const newStakes: Array<{
      garden: string
      gardenName: string
      items: Array<TransformedStakeType>
    }> = []

    const stakesPerGarden: Array<StakePerGarden> = getStakesByGarden(
      stakes,
      inactiveStakes
    )(gardensMetadata)

    stakesPerGarden.map((garden) => {
      const stakePercentagePerGarden = stakesPercentages(
        garden.items.map(({ amount }) => amount),
        {
          total: getTotalPerGarden(garden.items),
          maxIncluded:
            DISTRIBUTION_ITEMS_MAX_ACTIVE + DISTRIBUTION_ITEMS_MAX_INACTIVE,
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

export { getMyStakesPerGarden, refactorInactiveStakes }
