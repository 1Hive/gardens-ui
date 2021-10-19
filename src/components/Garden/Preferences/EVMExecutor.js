import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, DropDown, Field, GU, TextInput } from '@1hive/1hive-ui'
import { EVMcrispr } from '@1hive/evmcrispr'

import { useGardens } from '@/providers/Gardens'
import { useWallet } from '@/providers/Wallet'

import { SHORTENED_APPS_NAMES } from '@utils/app-utils'

function EVMExecutor() {
  const { ethers } = useWallet()
  const { connectedGarden } = useGardens()
  const [evmcrispr, setEvmcrispr] = useState(null)
  const [installedApps, setInstalledApps] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedFunction, setSelectedFunction] = useState(null)
  // const [parameters, setParameters] = useState([])

  useEffect(() => {
    async function getEvmCrispr() {
      if (!connectedGarden) {
        return
      }
      const crispr = await EVMcrispr.create(
        connectedGarden.address,
        ethers.getSigner()
      )

      setEvmcrispr(crispr)
    }
    getEvmCrispr()
  }, [connectedGarden, ethers])

  useEffect(() => {
    if (!evmcrispr) {
      return
    }
    const apps = evmcrispr.apps()
    setInstalledApps(apps)
  }, [evmcrispr])

  const shortenedAppsNames = installedApps.map(appName => {
    const dotIndex = appName.indexOf('.')
    return (
      SHORTENED_APPS_NAMES.get(
        dotIndex > 0
          ? appName.substr(0, appName.indexOf('.'))
          : appName.slice(0, -2)
      ) || appName.slice(0, -2)
    )
  })

  const functionList = useMemo(() => {
    if (!evmcrispr || shortenedAppsNames?.length === 0 || !selectedApp) {
      return
    }

    const appName = installedApps[selectedApp]

    const appFunctions = Object.getOwnPropertyNames(evmcrispr.call(appName))
    return appFunctions
  }, [evmcrispr, selectedApp, installedApps, shortenedAppsNames])

  const requiredParameters = useMemo(() => {
    if (!evmcrispr || !selectedApp || !selectedFunction) {
      return
    }

    const { paramNames, paramTypes } = evmcrispr.call(
      installedApps[selectedApp]
    )[functionList[selectedFunction]]

    console.log('param types ', paramTypes)

    return paramNames.map((parameter, index) => {
      return [parameter, paramTypes[index]]
    })
  }, [evmcrispr, installedApps, functionList, selectedApp, selectedFunction])

  console.log('required parameters ', requiredParameters)

  const handleOnChangeParameters = useCallback((index, e) => {
    console.log('index!! ', index)
  }, [])

  if (!connectedGarden || !ethers) {
    return null
  }

  return (
    <Box heading="App selector">
      <Field label="Select App">
        <DropDown
          items={shortenedAppsNames}
          onChange={setSelectedApp}
          selected={selectedApp}
          wide
        />
      </Field>
      {functionList?.length > 0 && (
        <Field label="Select Function">
          <DropDown
            items={functionList}
            onChange={setSelectedFunction}
            selected={selectedFunction}
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
                handleOnChange={() => handleOnChangeParameters(index)}
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
    </Box>
  )
}

export default EVMExecutor
