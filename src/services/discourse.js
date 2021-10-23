import env from '@/environment'

const ENDPOINT = 'https://forum.1hive.org/t/'
const DSICOURSE_API_TOKEN = env('DSICOURSE_API_TOKEN')
const DSICOURSE_API_USERNAME = env('DSICOURSE_API_USERNAME')

export const DISCOURSE_ID_REGEX = /.*\/t\/(.*\/[0-9]*).*/i

export async function getDiscourseTopic(id) {
  try {
    const result = await fetch(`${ENDPOINT}${id}.json`, {
      method: 'GET',
      headers: {
        'Api-Key': DSICOURSE_API_TOKEN,
        'Api-Username': DSICOURSE_API_USERNAME,
      },
    })

    const data = await result.json()
    return { data, error: !result.ok }
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}
