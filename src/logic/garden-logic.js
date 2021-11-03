import useActions from '@hooks/useActions'
import { useGardenState } from '@providers/GardenState'
import { useProposals } from '@hooks/useProposals'

// Handles the main logic of the app.
export default function useGardenLogic() {
  const {
    commonPool,
    config,
    errors,
    loading,
    mainToken,
    token,
    wrappableToken,
  } = useGardenState()

  const actions = useActions()
  const [
    proposals,
    filters,
    proposalsFetchedCount,
    blockHasLoaded,
  ] = useProposals()

  return {
    actions,
    commonPool: { value: commonPool, token: config?.conviction.requestToken },
    config,
    errors,
    filters,
    loading: loading || !blockHasLoaded,
    priceToken: mainToken.data,
    proposals,
    proposalsFetchedCount,
    totalActiveTokens: {
      value: config?.conviction.totalStaked,
      token: config?.conviction.stakeToken,
    },
    // mainToken: BYOT ? wrappableToken : token
    totalSupply: { value: mainToken.totalSupply, token: mainToken.data },
    // For BYOT we will also display the total suppply of the wrapped token
    totalWrappedSupply: wrappableToken
      ? { value: token.totalSupply, token: token.data }
      : null,
  }
}
