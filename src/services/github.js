import { getNetworkName } from '@utils/web3-utils'
import env from '@/environment'

const NETWORK = getNetworkName().toLowerCase()
const GITHUB_API_TOKEN = env('GITHUB_API_TOKEN')
const ENDPOINT_BASE = 'https://api.github.com/repos/1Hive/dao-list'

export const fetchLatestCommitSha = async () => {
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

export const fetchBaseTreeSha = async commitSha => {
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

export const createTree = async (baseTreSha, fileContent) => {
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

export const createCommit = async (latestCommitSha, newTreeSha, daoName) => {
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

export const createFileContent = async (
  folderName,
  fileName,
  base64,
  commitMsg
) => {
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

export const changeHeadsCommitSha = async commitSha => {
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

// This step must be called after the dao is published and we have the dao address
export const publishNewDao = async daoMetaData => {
  try {
    const { data: fileContent } = await fetchFileContent()
    await publishDaoAssets(daoMetaData)

    const newDaoList = fileContent.daos
    newDaoList.push({
      // address once we have it
      name: daoMetaData.name,
      description: daoMetaData.description,
      forum: daoMetaData.forum,
      links: daoMetaData.links,
      logo:
        daoMetaData.logo &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetaData.name}/logo.${daoMetaData.logoExtension}`,
      logo_type:
        daoMetaData.logo_type &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetaData.name}/logo_type.${daoMetaData.logo_typeExtension}`,
      token_logo:
        daoMetaData.token_logo &&
        `https://raw.githubusercontent.com/1Hive/dao-list/master/assets/${daoMetaData.name}/token_logo.${daoMetaData.token_logoExtension}`,
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
      daoMetaData.name
    )

    await changeHeadsCommitSha(commitSha)
  } catch (error) {
    console.error(error)
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

const publishDaoAssets = async daoMetaData => {
  try {
    if (daoMetaData.logo) {
      await createFileContent(
        daoMetaData.name,
        `logo.${daoMetaData.logoExtension}`,
        daoMetaData.logo,
        `Assets:${daoMetaData.name}-logo`
      )
    }
    if (daoMetaData.logo_type) {
      await createFileContent(
        daoMetaData.name,
        `logo_type.${daoMetaData.logo_typeExtension}`,
        daoMetaData.logo_type,
        `Assets:${daoMetaData.name}-logotype`
      )
    }
    if (daoMetaData.token_logo) {
      await createFileContent(
        daoMetaData.name,
        `token_logo.${daoMetaData.token_logoExtension}`,
        daoMetaData.token_logo,
        `Assets:${daoMetaData.name}-token_logo`
      )
    }
  } catch (error) {
    console.error(error)
  }
}
