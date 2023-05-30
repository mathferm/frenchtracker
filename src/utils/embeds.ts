import configuration from '../../configuration.js'

export const ERROR_EMBED = {
  title: configuration.messages.error.error,
  color: configuration.colors.error,
} as const

export const INFO_EMBED = {
  color: configuration.colors.info,
}

export const UNKNOWN_ERROR_EMBED = {
  description: configuration.messages.error.unknownError,
  ...ERROR_EMBED,
} as const

export const CANNOT_FIND_CENTRAL_SERVER_EMBED = {
  description: configuration.messages.error.cannotFindCentralServer,
  ...ERROR_EMBED,
} as const

export const CANNOT_FIND_GUILD_EMBED = {
  description: configuration.messages.error.cannotFindGuild,
  ...ERROR_EMBED,
} as const

export const SCAMMER_NOT_IN_LIST_EMBED = {
  description: configuration.messages.error.scammerNotInList,
  ...ERROR_EMBED,
} as const

export const INVALID_UUID_OR_NAME_EMBED = {
  description: configuration.messages.error.invalidUuidOrName,
  ...ERROR_EMBED,
} as const

export const INVALID_DISCORD_ID_EMBED = {
  description: configuration.messages.error.invalidDiscordId,
  ...ERROR_EMBED,
} as const
export const SCAMMER_ALREADY_IN_LIST_EMBED = {
  description: configuration.messages.error.scammerAlreadyInList,
  ...ERROR_EMBED,
} as const

export function SCAMMER_ADDED_EMBED(name: string, id: string | null = null) {
  return {
    title: configuration.messages.notifications.scammerAdded.title,
    description: configuration.messages.notifications.scammerAdded.description.replace('%scammer%', name),
    footer: id ? {
      text: id,
    } : undefined,
    ...INFO_EMBED,
  } as const
}

export function SCAMMER_REMOVED_EMBED(name: string, id: string | null = null) {
  return {
    title: configuration.messages.notifications.scammerRemoved.title,
    description: configuration.messages.notifications.scammerRemoved.description.replace('%scammer%', name),
    footer: id ? {
      text: id,
    } : undefined,
    ...INFO_EMBED,
  } as const
}

export function SCAMMER_FORCE_REMOVED_EMBED(name: string) {
  return {
    title: configuration.messages.notifications.scammerForceRemoved.title,
    description: configuration.messages.notifications.scammerForceRemoved.description.replace('%scammer%', name),
    ...INFO_EMBED,
  } as const
}