import { useEffect, useMemo, useState } from 'react'
import { useGardenState } from '@providers/GardenState'
import usePromise from '@hooks/usePromise'
import { getAppPresentationByAddress } from '@utils/app-utils'

const ANY_ADDRESS = "0xffffffffffffffffffffffffffffffffffffffff"

interface ManagerProps {
  address: string,
  shortenedName: string,
}

interface PermissionProps {
  allowed: boolean,
  appAddress: string,
  granteeAddress: string,
  granteeName: string | undefined,
  params: Array<any>,
  roleHash: string
}

interface RoleProps {
  appAddress: string,
  appName: string,
  appIcon: string,
  description: string | undefined, // TODO- check why this is happening proabably old ABI
  hash: string,
  manager: Array<ManagerProps>,
  name: string,
  params: Array<any>,
  permissions: Array<PermissionProps>
}

export function useRoles() {
  const [loading, setLoading] = useState<boolean>(true)
  const gardenState = useGardenState()

  const appsWithPermissions = useMemo(() => {
    if (!gardenState?.installedApps) {
      return async () => { null }
    }
    return () => Promise.all(gardenState?.installedApps.map(async (app: any) => {
      return {
        ...app,
        roles: await app.roles()
      }
    }))
  }, [gardenState])

  const appsWithRolesResolved = usePromise(appsWithPermissions, [], [])

  function isAnyAddress(address: string) {
    return address === ANY_ADDRESS
  }

  const rolesWithEntitiesResolved: Array<RoleProps> = appsWithRolesResolved ? appsWithRolesResolved.map((app: any) => {
    return app.roles.map((role: any) => {
      const appPresentation = getAppPresentationByAddress(gardenState?.installedApps, app.address)

      return {
        ...role,
        appName: appPresentation?.shortenedName || appPresentation?.humanName,
        appIcon: appPresentation?.iconSrc,
        manager: {
          address: role.manager,
          shortenedName: getAppPresentationByAddress(gardenState?.installedApps, role.manager)?.shortenedName,
          managerIcon: getAppPresentationByAddress(gardenState?.installedApps, role.manager)?.iconSrc
        },
        permissions: role.permissions.map((permission: any) => {
          return {
            ...permission,
            granteeName: isAnyAddress(permission.granteeAddress) ? 'Any account' : getAppPresentationByAddress(gardenState?.installedApps, permission.granteeAddress)?.shortenedName,
            granteeIcon: getAppPresentationByAddress(gardenState?.installedApps, permission.granteeAddress)?.iconSrc
          }
        })
      }
    })
  }) : null

  useEffect(() => {
    if (rolesWithEntitiesResolved) {
      setLoading(false)
    }
  }, [rolesWithEntitiesResolved])



  return [rolesWithEntitiesResolved ? rolesWithEntitiesResolved.flat() : [], loading]

}
