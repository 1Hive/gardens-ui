import { connectCeramic } from '@/hooks/useCeramic'
import { ProfileType } from '@/providers/Profile'

const getProfileForAccount = async (account: string): Promise<ProfileType> => {
  if (!account) {
    return null
  }

  const { idx } = connectCeramic()

  try {
    const data: ProfileType = await idx.get(
      'basicProfile',
      `${account}@eip155:1`
    )
    return data ?? {}
  } catch (error) {
    return {
      name: 'name',
      image: 'image',
    }
  }
}

export { getProfileForAccount }
