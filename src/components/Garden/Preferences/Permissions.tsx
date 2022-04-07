/* eslint-disable react/jsx-key */
import React from 'react'
import { DataView, IdentityBadge, textStyle } from '@1hive/1hive-ui'
import { useRoles } from '@/hooks/useRoles'
import Loader from '@components/Loader'

const ENTRIES_PER_PAGE = 10

function Permissions() {
  const [appRoles, loading] = useRoles()

  const fields = [
    'Action',
    'On app',
    { label: 'Assigned to entity', childStart: true },
    'Managed by',
  ]
  console.log('installed with perm ', appRoles)

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
          renderEntry={(entry: any) => renderEntry(entry)}
        />
      }
    </div>
  )
}

interface EntryProps {
  appAddress: string,
  appName: string,
  description: string,
  manager: any,
  permissions: any
}

function renderEntry({ appAddress, appName, description, manager, permissions }: EntryProps) {

  const cells = [
    <span
      css={`
        ${textStyle('body2')}
      `}
    >
      {description}
    </span>,
    <IdentityBadge label={appName} entity={appAddress} />,
    <IdentityBadge label={manager.shortenedName} entity={manager.address} />,
    <IdentityBadge label={permissions[0].granteeName} entity={permissions[0].granteeAddress} />,
  ]
  return cells
}

export default Permissions