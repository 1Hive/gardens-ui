const { UPLOAD_IPFS_ENDPOINT } = require('./endpoints')

export async function fetchPic(buffer) {
  const res = await fetch(UPLOAD_IPFS_ENDPOINT, {
    method: 'post',
    'Content-Type': 'multipart/form-data',
    body: buffer,
  })

  return res.json()
}
