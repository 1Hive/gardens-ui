import { exit } from 'process'
import { readSingle, EnvVars } from './read-env-file'

const ENV_PATH = './.env'
const ENV_TEMPLATE_PATH = './.env.example'

const THROW_ERROR_REQUIRED = true

async function check_env() {
  let env: EnvVars | undefined
  let envTemplate: EnvVars | undefined

  // Try load env example (template)
  try {
    envTemplate = await readSingle(ENV_TEMPLATE_PATH)
  } catch (error) {
    logCheckEnv(`'${ENV_TEMPLATE_PATH}' path not found`)
  }
  // Try load env
  try {
    env = await readSingle(ENV_PATH)
  } catch (error) {
    logCheckEnv(`'${ENV_PATH}' path not found`)
  }

  if (envTemplate) {
    const keysNotOptionals = extractNotOptionals(envTemplate)

    const arrMissingEnvs: string[] = []
    if (env) {
      for (const keyNotOptional of Object.keys(keysNotOptionals)) {
        const envKeys = Object.keys(env)

        // Filter .env keys and collect those equals required but dont have value setted in .env
        arrMissingEnvs.push(
          ...envKeys.filter((ek) => ek === keyNotOptional && env && !env[ek])
        )
        // Collect those required keys was setted but not found in .env
        if (!envKeys.includes(keyNotOptional)) {
          arrMissingEnvs.push(keyNotOptional)
        }
      }
    } else {
      logCheckEnv(
        `First clone '${ENV_TEMPLATE_PATH}' to '${ENV_PATH}' and run it again`
      )
      throw new Error('')
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
/**
 * Look for key with value different of empty
 * @param envTemplate - object representing EnvVars with key and values
 * @returns object with key and value not empty
 */
function extractNotOptionals(envTemplate: EnvVars) {
  let keysNotOptionals: EnvVars = {}

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

/**
 * Better associate to check-env script
 * @param toLog - som info to log
 */
function logCheckEnv(toLog: string) {
  console.log(`[check-env]: ${toLog}`)
}

check_env()
  .then(() => {
    logCheckEnv('🎉 All Environment Variables are configured properly! 🎉')
  })
  .catch(() => {
    exit(1)
  })
