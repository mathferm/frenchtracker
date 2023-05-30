import axios from 'axios'

export async function getUuidForName(name: string): Promise<string | null> {
  const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`).catch(() => null)
  return response?.data?.id
}

export async function getNameForUuid(uuid: string): Promise<string | null> {
  const response = await axios.get(`https://api.mojang.com/user/profile/${uuid}`).catch(() => null)
  return response?.data?.name
}
