import { getNetworkName } from '@utils/web3-utils'
import env from '@/environment'

const NETWORK = getNetworkName().toLowerCase()
const GITHUB_API_TOKEN = env('GITHUB_API_TOKEN')
const ENDPOINT_BASE = 'https://api.github.com/repos/1Hive/dao-list'

// This step must be called after the dao is published and we have the dao address
export async function publishNewDao(daoMetadata) {
  try {
    const { data: fileContent } = await fetchFileContent()
    await publishDaoAssets(daoMetadata)

    const newDaoList = fileContent.daos
    newDaoList.push({
      // address once we have it
      name: daoMetadata.name,
      description: daoMetadata.description,
      forum: daoMetadata.forum,
      links: daoMetadata.links,
      logo:
        daoMetadata.logo &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetadata.name}/logo.${daoMetadata.logoExtension}`,
      logo_type:
        daoMetadata.logo_type &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetadata.name}/logo_type.${daoMetadata.logo_typeExtension}`,
      token_logo:
        daoMetadata.token_logo &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetadata.name}/token_logo.${daoMetadata.token_logoExtension}`,
    })
    const newContent = {
      ...fileContent,
      daos: newDaoList,
    }

    const { data: latestCommitSha } = await fetchLatestCommitSha()
    const { data: baseTreSha } = await fetchBaseTreeSha(latestCommitSha)

    const { data: newTreeSha } = await createTree(baseTreSha, newContent)

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

const fetchBaseTreeSha = async commitSha => {
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

const createTree = async (baseTreSha, fileContent) => {
  const endpoint = `${ENDPOINT_BASE}/git/trees`

  const bodyData = {
    base_tree: baseTreSha,
    tree: [
      {
        path: `${NETWORK}.json`,
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

const changeHeadsCommitSha = async commitSha => {
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

export const fetchFileContent = async () => {
  const endpoint = `${ENDPOINT_BASE}/contents/${NETWORK}.json`
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
        Accept: 'application/vnd.github.VERSION.raw',
        'Content-Type': 'application/json',
      },
    })
    const data = await result.json()

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error fetching garden list content`, err)
    return { error: true }
  }
}

const publishDaoAssets = async daoMetadata => {
  try {
    if (daoMetadata.logo) {
      await createFileContent(
        daoMetadata.name,
        `logo.${daoMetadata.logoExtension}`,
        daoMetadata.logo,
        `Assets:${daoMetadata.name}-logo`
      )
    }
    if (daoMetadata.logo_type) {
      await createFileContent(
        daoMetadata.name,
        `logo_type.${daoMetadata.logo_typeExtension}`,
        daoMetadata.logo_type,
        `Assets:${daoMetadata.name}-logotype`
      )
    }
    if (daoMetadata.token_logo) {
      await createFileContent(
        daoMetadata.name,
        `token_logo.${daoMetadata.token_logoExtension}`,
        daoMetadata.token_logo,
        `Assets:${daoMetadata.name}-token_logo`
      )
    }
  } catch (error) {
    console.error(error)
  }
}
