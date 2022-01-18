import { getNetworkName } from '@utils/web3-utils'
import env from '@/environment'

const ASSETS_FOLDER_BASE =
  'https://raw.githubusercontent.com/1Hive/dao-list/master/assets'
const ENDPOINT_BASE = 'https://api.github.com/repos/1Hive/dao-list'
const GITHUB_API_TOKEN = env('GITHUB_API_TOKEN')

// This step must be called after the dao is published and we have the dao address
export async function publishNewDao(daoAddress, daoMetadata, chainId) {
  try {
    const { data: fileContent } = await fetchFileContent(chainId)
    await publishDaoAssets(daoMetadata)

    console.log(`publishNewDao`)
    console.log(daoMetadata)

    const newDaoList = fileContent.gardens
    newDaoList.push({
      address: daoAddress,
      name: daoMetadata.name,
      description: daoMetadata.description,
      forum: daoMetadata.forum,
      links: daoMetadata.links,
      logo:
        daoMetadata.logo &&
        `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/logo.${daoMetadata.logo.imageExtension}`,
      logo_type:
        daoMetadata.logo_type &&
        `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/logo_type.${daoMetadata.logo_type.imageExtension}`,
      token_logo:
        daoMetadata.token_logo &&
        `${ASSETS_FOLDER_BASE}/${daoMetadata.name}/token_logo.${daoMetadata.token_logo.imageExtension}`,
    })
    const newContent = {
      ...fileContent,
      gardens: newDaoList,
    }

    const { data: latestCommitSha } = await fetchLatestCommitSha()
    const { data: baseTreSha } = await fetchBaseTreeSha(latestCommitSha)

    const { data: newTreeSha } = await createTree(
      baseTreSha,
      newContent,
      chainId
    )

    const { data: commitSha } = await createCommit(
      latestCommitSha,
      newTreeSha,
      daoMetadata.name
    )

    await changeHeadsCommitSha(commitSha)
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
        Authorization: `token ${GITHUB_API_TOKEN}`,
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

const fetchBaseTreeSha = async (commitSha) => {
  const endpoint = `${ENDPOINT_BASE}/git/commits/${commitSha}`
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
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

export const createTree = async (baseTreSha, fileContent, chainId) => {
  const endpoint = `${ENDPOINT_BASE}/git/trees`
  const network = getNetworkName(chainId).toLowerCase()

  const bodyData = {
    base_tree: baseTreSha,
    tree: [
      {
        path: `${network}.json`,
        mode: '100644',
        type: 'blob',
        content: JSON.stringify(fileContent, null, 4),
      },
    ],
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    const data = await result.json()

    return { data: data.sha, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting tree sha`, err)
    return { error: true }
  }
}

const createCommit = async (latestCommitSha, newTreeSha, daoName) => {
  const endpoint = `${ENDPOINT_BASE}/git/commits`
  const bodyData = {
    parents: [latestCommitSha],
    tree: newTreeSha,
    message: ` ${daoName} added`,
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    const data = await result.json()

    return { data: data.sha, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting tree sha`, err)
    return { error: true }
  }
}

const createFileContent = async (folderName, fileName, base64, commitMsg) => {
  const endpoint = `${ENDPOINT_BASE}/contents/assets/${folderName}/${fileName}`

  const bodyData = {
    owner: '1Hive',
    repo: 'dao-list',
    path: fileName,
    message: commitMsg,
    content: base64,
  }
  try {
    const result = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
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

const changeHeadsCommitSha = async (commitSha) => {
  const endpoint = `${ENDPOINT_BASE}/git/refs/heads/master`
  const bodyData = {
    sha: commitSha,
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
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

export const fetchFileContent = async (chainId) => {
  const network = getNetworkName(chainId).toLowerCase()
  const endpoint = `${ENDPOINT_BASE}/contents/${network}.json`

  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
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

const publishDaoAssets = async (daoMetadata) => {
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
