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
    logCheckEnv(`'${ENV_TEMPLATE_PATH}' path not found`)
  }
  try {
    env = await readSingle(ENV_PATH) // Attempts to read from ./.env
  } catch (error) {
    logCheckEnv(`'${ENV_PATH}' path not found`)
  }
  if (envTemplate) {
    const keysNotOptionals = extractNotOptionals(envTemplate)

    const arrMissingEnvs: string[] = []
    if (env) {
      const arrKeys = Object.keys(keysNotOptionals)
      for (const keyNotOptional of arrKeys) {
        const envKeys = Object.keys(env)

        arrMissingEnvs.push(
          ...envKeys.filter((ek) => ek === keyNotOptional && env && !env[ek])
        )
        if (!envKeys.includes(keyNotOptional)) {
          arrMissingEnvs.push(keyNotOptional)
        }
      }
    } else {
      logCheckEnv(
        `First clone '${ENV_TEMPLATE_PATH}' to '${ENV_PATH}' and run it again`
      )
    }

    if (arrMissingEnvs.length > 0 && THROW_ERROR_REQUIRED) {
      arrMissingEnvs.forEach((envKey) =>
        logCheckEnv(`🛑 Missing Env ${envKey}`)
      )

      logCheckEnv(
        `🛑 Missing Envs were defined required (not optional) in '${ENV_TEMPLATE_PATH}', create it at '${ENV_PATH}' and run it again 🛑`
      )
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

function logCheckEnv(toLog: string) {
  console.log(`[check-env]: ${toLog}`)
}

check_env()
  .then(() => {
    logCheckEnv('🎉 ENVs setup correctly! 🎉')
  })
  .catch(() => {
    exit(1)
  })
