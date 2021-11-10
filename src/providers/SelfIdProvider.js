import { EthereumAuthProvider, SelfID } from '@self.id/web'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useCeramicDID } from '../hooks/useCeramicDID'
import { useWallet } from './Wallet'
import { CERAMIC_CONNECT_NETWORK, CERAMIC_ENDPOINT } from '@/endpoints'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { usePrevious } from '@/hooks/usePrevious'

export const SelfIdContext = createContext({
  myDID: null,
  mySelfId: null,
  isConnecting: false,
  connect: () => Promise.resolve(),
  disconnect: () => {},
})

const STORAGE_KEY = '__selfID_connectedAddress__'

export const SelfIdProvider = ({ children }) => {
  const [mySelfId, setMySelfId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const { ethereum, account: address } = useWallet()

  const [
    connectedAddress,
    setConnectedAddress,
    removeConnectedAddress,
  ] = useLocalStorage(STORAGE_KEY, null)

  const { data: myDID } = useCeramicDID(address)

  const connect = useCallback(async () => {
    if (!ethereum || !address) {
      console.error('No Ethereum Wallet Connected')
    }
    try {
      setIsConnecting(true)
      const self = await SelfID.authenticate({
        authProvider: new EthereumAuthProvider(ethereum, address),
        ceramic: CERAMIC_ENDPOINT,
        connectNetwork: CERAMIC_CONNECT_NETWORK,
      })
      setMySelfId(self)
      setConnectedAddress(address)
      setIsConnecting(false)
    } catch (e) {
      setIsConnecting(false)
      console.error(`Unable to connect to Ceramic: ${e}`)
    }
  }, [ethereum, address, setConnectedAddress])

  const disconnect = useCallback(() => {
    setMySelfId(null)
    removeConnectedAddress()
  }, [removeConnectedAddress])

  const prevAddress = usePrevious(address)

  // Reset SelfID every time address changes
  useEffect(() => {
    if (prevAddress && address !== prevAddress) {
      disconnect()
    }
  }, [disconnect, address, prevAddress])

  // Automatically connect to SelfID if previously connected
  useEffect(() => {
    ;(async () => {
      const wasPreviouslyConnected = address && address === connectedAddress
      if (!mySelfId && wasPreviouslyConnected) {
        try {
          await connect()
        } catch (e) {
          console.warn('Unable to reconnect to SelfID', e)
        }
      }
    })()
  }, [connect, address, connectedAddress, mySelfId])

  useEffect(() => {
    if (!ethereum || !address) disconnect()
  }, [disconnect, ethereum, address])

  return (
    <SelfIdContext.Provider
      value={{
        myDID,
        mySelfId,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </SelfIdContext.Provider>
  )
}

export const useSelfId = () => useContext(SelfIdContext)
