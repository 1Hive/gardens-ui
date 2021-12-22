import { renderHook } from '@testing-library/react-hooks'
import 'cross-fetch'

// import fetch from 'cross-fetch'
import { useCelesteSynced } from '../useCeleste'

it('should return valid array with 2 booleans', async () => {
  const { result } = renderHook(() => useCelesteSynced(4))

  // const config = await useCelesteConfigPoll(4)
  console.log(result.current)
  expect(result.current).toBeTruthy()
  expect(result.current.length).toBe(2)
}, 15000)
