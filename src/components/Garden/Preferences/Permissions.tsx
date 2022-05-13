/* eslint-disable react/jsx-key */
import React from 'react'
import { AppBadge, DataView, IdentityBadge, textStyle } from '@1hive/1hive-ui'
import { useGardenState } from '@providers/GardenState'
import { useRoles } from '@/hooks/useRoles'
import Loader from '@components/Loader'
import { getAppPresentationByAddress } from '@utils/app-utils'

const ENTRIES_PER_PAGE = 10

interface EntryProps {
  appAddress: string,
  appIcon: string,
  appName: string,
  description: string,
  manager: any,
  permissions: any
}


function Permissions() {
  const [appRoles, loading] = useRoles()
  const { installedApps } = useGardenState()

  console.log('APP ROLES ', appRoles)

  const fields = [
    'Action',
    'On app',
    { label: 'Assigned to entity', childStart: true },
    'Managed by',
  ]
  // console.log('installed with perm ', appRoles)

  return (
    <div css={`height: 100%;`}>
      {loading ?
        (

          <Loader />
        ) :
        <DataView
          entriesPerPage={ENTRIES_PER_PAGE}
          fields={fields}
          entries={appRoles}
          renderEntry={(entry: EntryProps) => renderEntry(entry, installedApps)}
          renderEntryExpansion={(entry: EntryProps) => renderEntryExpansion(entry, installedApps)}
        />
      }
    </div>
  )
}

interface EntryProps {
  appAddress: string,
  appIcon: string,
  appName: string,
  description: string,
  manager: any,
  permissions: any
}

function EntryEntities({ permissions, installedApps }: { permissions: any, installedApps: any }) {
  const allowedEntities = permissions.filter((permission: any) => permission.allowed === true)

  if (allowedEntities.length === 1) {
    return <EntityBadge address={permissions[0].granteeAddress} name={permissions[0].granteeName} icon={permissions[0].granteeIcon} installedApps={installedApps} />
  }

  return <span
    css={`
          ${textStyle('body2')}
        `}
  >
    {allowedEntities.length} entities
  </span>
}

function EntityBadge({ address, name, icon, installedApps }: { address: string, name: string, icon: string, installedApps: any }) {
  if (installedApps.find((app: any) => app.address === address)) {

    return <AppBadge appAddress={address} iconSrc={icon} label={name} entity={address} />
  }

  return <IdentityBadge label={name} entity={address} />
}


function renderEntry(entry: EntryProps, installedApps: any) {

  const { appAddress, appIcon, appName, description, manager, permissions } = entry
  console.log('ENTRY ', entry)
  const cells = [
    <span
      css={`
        ${textStyle('body2')}
      `}
    >
      {description}
    </span>,
    <AppBadge appAddress={appAddress} iconSrc={appIcon} label={appName} entity={appAddress} />,
    <EntryEntities permissions={permissions} installedApps={installedApps} />,
    // <IdentityBadge label={permissions[0].granteeName} entity={permissions[0].granteeAddress} />,
    <EntityBadge address={manager.address} name={manager.shortenedName} icon={manager.managerIcon} installedApps={installedApps} />

  ]
  return cells
}

function renderEntryExpansion(entry: EntryProps, installedApps: any) {
  const allowedEntities = entry.permissions.filter((permission: any) => permission.allowed === true)

  return allowedEntities.length < 2
    ? null
    : allowedEntities.map((entity: any) => (
      <EntityBadge address={entity.granteeAddress} name={entity.granteeName} icon={entity.granteeIcon} installedApps={installedApps} />
    ))
}





export default Permissions