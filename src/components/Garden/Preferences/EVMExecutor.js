/* eslint-disable no-unexpected-multiline */
import React, { useCallback, useMemo, useState } from 'react'
import { utils } from 'ethers'
import {
  Box,
  Button,
  DropDown,
  Field,
  GU,
  Info,
  TextInput,
} from '@1hive/1hive-ui'
import MultiModal from '@components/MultiModal/MultiModal'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { SHORTENED_APPS_NAMES } from '@utils/app-utils'
import { getAppByName } from '@utils/data-utils'
import actions from '@/actions/garden-action-types'
import { TERMINAL_EXECUTOR_MESSAGE } from '@/constants'
import env from '@/environment'
import { useGardenState } from '@/providers/GardenState'
import { useWallet } from '@/providers/Wallet'
import radspec from '@/radspec'
import CreateDecisionScreens from '../ModalFlows/CreateDecisionScreens/CreateDecisionScreens'

const INTERACTION_TYPES = ['Internal', 'External', 'Terminal']

const INTERNAL_INDEX = 0
const EXTERNAL_INDEX = 1
const TERMINAL_INDEX = 2

function EVMExecutor({ evmcrispr }) {
  const { account, ethers } = useWallet()
  const gardenState = useGardenState()

  const connectedGarden = useConnectedGarden()
  const [createDecisionModalVisible, setCreateDecisionModalVisible] =
    useState(false)
  const [abi, setAbi] = useState()
  const [externalContractAddress, setExternalContractAddress] = useState(null)
  const [formattedAbi, setFormattedAbi] = useState(null)
  const [interactionType, setInteractionType] = useState(0)
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedFunction, setSelectedFunction] = useState(null)
  const [parameters, setParameters] = useState([])
  const [code, setCode] = useState(null)

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  const terminalMode = interactionType === TERMINAL_INDEX

  const forwarderName = useMemo(() => {
    if (!gardenState || !gardenState.installedApps) {
      return null
    }

    return getAppByName(
      gardenState.installedApps,
      env('VOTING_APP_NAME')
    ).artifact.appName.split('.aragonpm.eth')[0]
  }, [gardenState])

  const installedApps = useMemo(() => {
    if (!evmcrispr) {
      return []
    }
    return evmcrispr.apps()
  }, [evmcrispr])

  const shortenedAppsNames = installedApps.map(appName => {
    const dotIndex = appName.indexOf('.')
    return (
      SHORTENED_APPS_NAMES.get(
        dotIndex > 0 ? appName.substr(0, dotIndex) : appName.slice(0, -2)
      ) || appName.slice(0, -2)
    )
  })

  const functionList = useMemo(() => {
    let appFunctions
    if (interactionType === INTERNAL_INDEX) {
      if (!evmcrispr || shortenedAppsNames?.length === 0 || !selectedApp) {
        return []
      }

      const appName = installedApps[selectedApp]

      appFunctions = evmcrispr.appMethods(appName)
    }
    if (interactionType === EXTERNAL_INDEX && formattedAbi) {
      appFunctions = formattedAbi.map(item => {
        if (item.type === 'function' && item.stateMutability !== 'view') {
          return item.name
        }
      })
    }
    return appFunctions
  }, [
    evmcrispr,
    formattedAbi,
    interactionType,
    selectedApp,
    installedApps,
    shortenedAppsNames,
  ])

  const requiredParameters = useMemo(() => {
    if (selectedFunction === null) {
      return []
    }
    if (interactionType === INTERNAL_INDEX) {
      if (!evmcrispr || !selectedApp) {
        return []
      }

      const { paramNames, paramTypes } = evmcrispr.exec(
        installedApps[selectedApp]
      )[functionList[selectedFunction]]

      return paramNames.map((parameter, index) => {
        return [parameter, paramTypes[index]]
      })
    }
    if (interactionType === EXTERNAL_INDEX && formattedAbi) {
      return formattedAbi[selectedFunction].inputs.map(parameter => {
        return [parameter.name, parameter.type]
      })
    }
  }, [
    evmcrispr,
    formattedAbi,
    installedApps,
    interactionType,
    functionList,
    selectedApp,
    selectedFunction,
  ])

  const humanReadableSignature = useMemo(() => {
    if (!formattedAbi || selectedFunction === null) {
      return ''
    }
    let signature = `${formattedAbi[selectedFunction].name}(`

    formattedAbi[selectedFunction].inputs.forEach(
      (element, index, array) => {
        signature =
          index < array.length - 1
            ? `${signature}${element.type},`
            : `${signature}${element.type})`
      },
      [signature]
    )
    return signature
  }, [formattedAbi, selectedFunction])

  const handleOnChangeParameters = useCallback((index, event) => {
    const newValue = event.target.value
    setParameters(prevState => {
      const newArray = [...prevState]
      newArray[index] = newValue
      return newArray
    })
  }, [])

  const handleOnCreateIntent = useCallback(async () => {
    if (!forwarderName) {
      return []
    }
    const description = radspec[actions.NEW_DECISION]()
    const type = actions.NEW_DECISION

    let intent
    // TODO: just for now that for some reason the radspec description on the card is not working, after fixed we can ask the user for enter some forum post related to why the decision is being created
    // { context: asciiToHex(functionList[selectedFunction]) }
    // having some issue on the lib when passing the function that need to check with david
    if (interactionType === INTERNAL_INDEX) {
      intent = await evmcrispr.encode(
        [
          evmcrispr
            .exec(installedApps[selectedApp])
            [functionList[selectedFunction]](...parameters),
        ],
        [forwarderName],
        { context: 'new decision' }
      )
    }
    if (interactionType === EXTERNAL_INDEX) {
      intent = await evmcrispr.encode(
        [
          evmcrispr.act(
            evmcrispr.app('agent'),
            externalContractAddress,
            humanReadableSignature,
            [...parameters]
          ),
        ],
        [forwarderName],
        { context: 'new decision' }
      )
    }
    if (terminalMode) {
      if (!isSafari) {
        const { evmcl } = await import('@1hive/evmcrispr')
        intent = await evmcrispr.encode(evmcl`${code}`, [forwarderName], {
          context: 'new decision',
        })
      }
    }

    return [{ ...intent.action, description: description, type: type }]
  }, [
    forwarderName,
    interactionType,
    terminalMode,
    evmcrispr,
    installedApps,
    selectedApp,
    functionList,
    selectedFunction,
    parameters,
    externalContractAddress,
    humanReadableSignature,
    isSafari,
    code,
  ])

  const handleOnContractAddressChange = useCallback(event => {
    const value = event.target.value
    setExternalContractAddress(value)
  }, [])

  const handleOnAbiChange = useCallback(event => {
    const value = event.target.value
    setAbi(value)
    let iface
    let formattedAbi
    try {
      iface = new utils.Interface(value)
      formattedAbi = iface.format(utils.FormatTypes.json)
      setFormattedAbi(
        JSON.parse(formattedAbi).filter(item => {
          if (item.type === 'function' && item.stateMutability !== 'view') {
            return item.name
          }
        })
      )
    } catch (error) {
      console.error('Error parsing ABI ', error)
    }
  }, [])

  const handleOnShowModal = useCallback(() => {
    setCreateDecisionModalVisible(true)
  }, [])

  const handleOnHideModal = useCallback(() => {
    setCreateDecisionModalVisible(false)
  }, [])

  const handleOnSetCode = useCallback(event => {
    const value = event.target.value
    setCode(value)
  }, [])

  if (!connectedGarden || !ethers) {
    return null
  }

  return (
    <Box heading="App selector">
      <Field label="Interaction type">
        <DropDown
          items={INTERACTION_TYPES}
          onChange={setInteractionType}
          selected={interactionType}
          wide
        />
      </Field>
      {interactionType === INTERNAL_INDEX && (
        <Field label="Select App">
          <DropDown
            items={shortenedAppsNames}
            onChange={setSelectedApp}
            selected={selectedApp}
            disabled={!shortenedAppsNames.length > 0}
            wide
          />
        </Field>
      )}
      {interactionType === EXTERNAL_INDEX && (
        <>
          <Field label="Contract address">
            <TextInput
              value={externalContractAddress}
              wide
              onChange={handleOnContractAddressChange}
            />
          </Field>
          <Field label="ABI">
            <TextInput
              multiline
              value={abi}
              wide
              onChange={handleOnAbiChange}
              css={`
                min-height: ${30 * GU}px;
              `}
            />
          </Field>
        </>
      )}
      {terminalMode && (
        <TextInput
          onChange={handleOnSetCode}
          placeholder={TERMINAL_EXECUTOR_MESSAGE}
          wide
          multiline
          css={`
            min-height: ${50 * GU}px;
          `}
        />
      )}
      {functionList?.length > 0 && (
        <Field label="Select Function">
          <DropDown
            items={functionList}
            onChange={setSelectedFunction}
            selected={selectedFunction}
            disabled={!functionList.length > 0}
            wide
          />
        </Field>
      )}
      {requiredParameters?.length > 0 && (
        <Field label="Arguments">
          {requiredParameters.map((parameter, index) => {
            return (
              <TextInput
                key={index}
                onChange={event => handleOnChangeParameters(index, event)}
                placeholder={`${parameter[0].toString()} : ${parameter[1].toString()}`}
                wide
                css={`
                  margin-bottom: ${2 * GU}px;
                `}
              />
            )
          })}
        </Field>
      )}
      {!account && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        >
          You must connect your account in order to create a decision.
        </Info>
      )}
      {selectedFunction !== null || terminalMode ? (
        <Button
          css={`
            margin-top: ${terminalMode ? 2 * GU : 0}px;
          `}
          disabled={isSafari || !account || (terminalMode && !code)}
          mode="strong"
          wide
          onClick={handleOnShowModal}
        >
          Execute
        </Button>
      ) : (
        <> </>
      )}
      <MultiModal
        visible={createDecisionModalVisible}
        onClose={handleOnHideModal}
      >
        <CreateDecisionScreens onCreateTransaction={handleOnCreateIntent} />
      </MultiModal>
    </Box>
  )
}

export default EVMExecutor
