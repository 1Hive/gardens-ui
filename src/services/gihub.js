import gardenLogo from '../assets/defaultGardenLogo.png'

export const fetchLatestCommitSha = async () => {
  const endpoint =
    'https://api.github.com/repos/rperez89/dao-list-test/git/refs/heads/master'
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: ,
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
  const endpoint = `https://api.github.com/repos/rperez89/dao-list-test/git/commits/${commitSha}`
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: ,
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
  const endpoint = `https://api.github.com/repos/rperez89/dao-list-test/git/trees`

  const bodyData = {
    base_tree: baseTreSha,
    tree: [
      {
        path: 'gardens-dao-list.json',
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
        Authorization: ,
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

export const createCommit = async (latestCommitSha, newTreeSha) => {
  const endpoint = `https://api.github.com/repos/rperez89/dao-list-test/git/commits`
  const bodyData = {
    parents: [latestCommitSha],
    tree: newTreeSha,
    message: 'New DAO added',
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: ,
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

export const createFileContent = async commitSha => {
  const endpoint = `https://api.github.com/repos/rperez89/dao-list-test/contents/image2.png`

  const img = new Image()
  img.src = gardenLogo
  img.crossOrigin = 'Anonymous'

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.height = img.naturalHeight
  canvas.width = img.naturalWidth
  ctx.drawImage(img, 0, 0)

  const b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '')

  const bodyData = {
    owner: 'rperez89',
    repo: 'dao-list-test',
    path: 'image2.png',
    message: 'assets',
    content: b64,
  }
  try {
    const result = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization:,
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
  const endpoint = `https://api.github.com/repos/rperez89/dao-list-test/git/refs/heads/master`
  const bodyData = {
    sha: commitSha,
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: ,
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

export const commitNewDao = async () => {
  const { data: fileContent } = await fetchFileContent()
  const newDaoList = fileContent.daos
  newDaoList.push({
    address: 'HOLAAAAAA!!!!', // 0x52605d44Ae93Afc4e876cb1FE24aEf91336884Df
  })
  const newContent = {
    ...fileContent,
    daos: newDaoList,
  }
  const createAssetsContent = await createFileContent()
  console.log('content response ', createAssetsContent)
  const { data: latestCommitSha } = await fetchLatestCommitSha()
  console.log('latestCommitSha ', latestCommitSha)
  const { data: baseTreSha } = await fetchBaseTreeSha(latestCommitSha)
  console.log('treSha ', baseTreSha)

  const { data: newTreeSha } = await createTree(baseTreSha, newContent)

  const { data: commitSha } = await createCommit(latestCommitSha, newTreeSha)

  const changeHeadsShaResult = await changeHeadsCommitSha(commitSha)

  console.log('commitResult ', changeHeadsShaResult)
}

export const fetchFileContent = async () => {
  const endpoint =
    'https://api.github.com/repos/rperez89/dao-list-test/contents/gardens-dao-list.json'
  try {
    console.log('fetching!!!!')
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: ,
        Accept: 'application/vnd.github.VERSION.raw',
        'Content-Type': 'application/json',
      },
    })
    const data = await result.json()

    console.log('data!!!!!', data)

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error fetching garden list content`, err)
    return { error: true }
  }
}
