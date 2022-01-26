import { exit } from 'process'
import { readSingle, EnvVars } from './read-env-file'

const ENV_PATH = './.env'
const ENV_TEMPLATE_PATH = './.env.example'

const THROW_ERROR_REQUIRED = true

async function check_env() {
  let env: EnvVars | undefined
  let envTemplate: EnvVars | undefined
  try {
    envTemplate = await readSingle(ENV_TEMPLATE_PATH)
  } catch (error) {
    console.log(`'${ENV_TEMPLATE_PATH}' path not found`)
  }
  try {
    env = await readSingle(ENV_PATH) // Attempts to read from ./.env
  } catch (error) {
    console.log(`'${ENV_PATH}' path not found`)
  }
  if (envTemplate) {
    const keysNotOptionals = extractNotOptionals(envTemplate)

    let isFoundRequired = false

    if (env) {
      const arrKeys = Object.keys(keysNotOptionals)
      for (const keyNotOptional of arrKeys) {
        for (const envKey of Object.keys(env)) {
          if (envKey === keyNotOptional && !env[envKey]) {
            isFoundRequired = true
            console.log(
              `WARNING: Missing Env ${envKey} it's defined not optional (required) in '${ENV_TEMPLATE_PATH}', create it on '${ENV_PATH}' and run it again`
            )
          }
        }
      }
    } else {
      console.log(
        `First clone '${ENV_TEMPLATE_PATH}' to '${ENV_PATH}' and run it again`
      )
    }

    if (isFoundRequired && THROW_ERROR_REQUIRED) {
      throw new Error('Missing Required Envs, check the logs')
    }
  } else {
    throw new Error(
      `Something goes wrong. Env template in the path '${ENV_TEMPLATE_PATH}' not found`
    )
  }
}

function extractNotOptionals(envTemplate: EnvVars) {
  let keysNotOptionals = {} as Record<string, string | undefined>

  for (const keyTemplate of Object.keys(envTemplate)) {
    const valueTemplate = envTemplate[keyTemplate]

    if (valueTemplate && valueTemplate !== '')
      keysNotOptionals = {
        ...keysNotOptionals,
        [keyTemplate]: envTemplate[keyTemplate],
      }
  }
  return keysNotOptionals
}

check_env()
  .then(() => {
    console.log('ENVs setup correctly!')
  })
  .catch((err) => {
    console.error(err)
    exit(1)
  })
