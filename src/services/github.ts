import { getNetworkName } from '@utils/web3-utils'
import env from '@/environment'

const OWNER_REPO = env('OWNER_REPO_DAO_LIST') === null ? 'kamikazebr' : '1Hive' //TODO: Change or remove it after tests

const ASSETS_FOLDER_BASE = `https://raw.githubusercontent.com/${OWNER_REPO}/dao-list/master/assets`
const ENDPOINT_BASE = `https://api.github.com/repos/${OWNER_REPO}/dao-list`
const ANOTHER_ENDPOINT_BASE = 'http://localhost:3001' // TODO: Migrate to ENV vars and change the name the var.

// This step must be called after the dao is published and we have the dao address
export async function publishNewDao(
  daoAddress: string,
  daoMetadata: GardenMetadataType,
  chainId: number
) {
  try {
    const { data: fileContent, error: errorFileContent } =
      await fetchFileContent(chainId)
    if (errorFileContent || !fileContent) {
      throw new Error('fetchFileContent some error') //TODO It should threat errors different, without return error bolean
    }
    await publishDaoAssets(daoMetadata)

    const newDaoList = fileContent.gardens

    newDaoList.push({
      address: daoAddress,
      name: daoMetadata.name,
      description: daoMetadata.description,
      forum: daoMetadata.forum,
      links: daoMetadata.links,
      logo: daoMetadata.logo
        ? `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/logo.${daoMetadata.logo.imageExtension}`
        : null,
      logo_type: daoMetadata.logo_type
        ? `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/logo_type.${daoMetadata.logo_type.imageExtension}`
        : null,
      token_logo: daoMetadata.token_logo
        ? `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/token_logo.${daoMetadata.token_logo.imageExtension}`
        : null,
    })
    const newContent = {
      ...fileContent,
      gardens: newDaoList,
    }

    const { data: latestCommitSha } = await fetchLatestCommitSha()
    const { data: baseTreSha } = await fetchBaseTreeSha(latestCommitSha)

    const networkName = getNetworkName(chainId).toLowerCase()

    await createTreeCommitAndChangeHeads({
      baseTreSha,
      latestCommitSha,
      daoMetadataName: daoMetadata.name,
      newContent,
      networkName,
    })
  } catch (error) {
    console.error(error)
  }
}

const fetchLatestCommitSha = async () => {
  const endpoint = `${ENDPOINT_BASE}/git/refs/heads/master`
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    })
    const data = await result.json()

    return { data: data.object.sha, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting commit sha`, err)
    return { error: true }
  }
}

const fetchBaseTreeSha = async (commitSha: string) => {
  const endpoint = `${ENDPOINT_BASE}/git/commits/${commitSha}`
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    })
    const data = await result.json()

    return { data: data.tree.sha, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting tree sha`, err)
    return { error: true }
  }
}

type TreeCommitParams = {
  baseTreSha: string
  latestCommitSha: string
  daoMetadataName: string
  newContent: any
  networkName: string
}

export const createTreeCommitAndChangeHeads = async ({
  baseTreSha,
  latestCommitSha,
  daoMetadataName,
  newContent,
  networkName,
}: TreeCommitParams) => {
  const endpoint = `${ANOTHER_ENDPOINT_BASE}/v1/dao`

  const bodyData = {
    baseTreSha,
    latestCommitSha,
    daoMetadataName,
    newContent,
    networkName,
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    const data = await result.json()
    console.log(data)
    return { data: data, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting createTreeCommitAndChangeHeads`, err)
    return { error: true }
  }
}

const createFileContent = async (
  folderName: string,
  fileName: string,
  base64: string,
  commitMsg: string
) => {
  const endpoint = `${ANOTHER_ENDPOINT_BASE}/v1/daoAssets`

  const bodyData = {
    pathFileName: fileName,
    commitMessage: commitMsg,
    contentBase64: base64,
    folderName,
  }

  try {
    const result = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    const data = await result.json()

    return { data: data, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting tree sha`, err)
    return { error: true }
  }
}

type Base64ExtType = {
  imageExtension: string
  base64: string
}

type LinksMetadadaType = {
  community?: Array<Record<string, unknown>>
  documentation?: Array<Record<string, unknown>>
}

type GardenMetadataType = {
  address: string
  name: string
  description: string
  forum: string
  links?: LinksMetadadaType
  logo?: Base64ExtType
  logo_type?: Base64ExtType
  token_logo?: Base64ExtType
}

type GardenMetadataGithubType = Omit<
  GardenMetadataType,
  'logo' | 'logo_type' | 'token_logo'
> & {
  logo: string | null
  logo_type: string | null
  token_logo: string | null
}

type FileContentMetadataGithub = {
  data?: {
    gardens: Array<GardenMetadataGithubType>
  }
  error: boolean
}

export const fetchFileContent = async (
  chainId: number
): Promise<FileContentMetadataGithub> => {
  const network = getNetworkName(chainId).toLowerCase()
  const endpoint = `${ENDPOINT_BASE}/contents/${network}.json`

  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.VERSION.raw',
        'Content-Type': 'application/json',
      },
    })

    let data
    try {
      data = await result.json()
    } catch (err) {
      console.log('error parsing result ', err)
    }

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error fetching garden list content`, err)
    return { error: true }
  }
}

const publishDaoAssets = async (daoMetadata: GardenMetadataType) => {
  try {
    if (daoMetadata.logo) {
      await createFileContent(
        daoMetadata.name,
        `logo.${daoMetadata.logo.imageExtension}`,
        daoMetadata.logo.base64,
        `Assets:${daoMetadata.name}-logo`
      )
    }
    if (daoMetadata.logo_type) {
      await createFileContent(
        daoMetadata.name,
        `logo_type.${daoMetadata.logo_type.imageExtension}`,
        daoMetadata.logo_type.base64,
        `Assets:${daoMetadata.name}-logotype`
      )
    }
    if (daoMetadata.token_logo) {
      await createFileContent(
        daoMetadata.name,
        `token_logo.${daoMetadata.token_logo.imageExtension}`,
        daoMetadata.token_logo.base64,
        `Assets:${daoMetadata.name}-token_logo`
      )
    }
  } catch (error) {
    console.error(error)
  }
}
