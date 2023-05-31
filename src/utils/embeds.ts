import configuration from '../../configuration.js'
import { SUCCESS_EMBED } from './misc.js'

export const ERROR_EMBED = ({
  title: configuration.messages.error.error,
  color: configuration.colors.error,
}) as const

export const INFO_EMBED = ({
  color: configuration.colors.info,
}) as const

export const UNKNOWN_ERROR_EMBED = ({
  description: configuration.messages.error.unknownError,
  ...ERROR_EMBED,
}) as const

export const CANNOT_FIND_CENTRAL_SERVER_EMBED = ({
  description: configuration.messages.error.cannotFindCentralServer,
  ...ERROR_EMBED,
}) as const

export const CANNOT_FIND_GUILD_EMBED = ({
  description: configuration.messages.error.cannotFindGuild,
  ...ERROR_EMBED,
}) as const

export const SCAMMER_NOT_IN_LIST_EMBED = ({
  description: configuration.messages.error.scammerNotInList,
  ...ERROR_EMBED,
}) as const

export const INVALID_UUID_OR_NAME_EMBED = ({
  description: configuration.messages.error.invalidUuidOrName,
  ...ERROR_EMBED,
}) as const

export const INVALID_DISCORD_ID_EMBED = ({
  description: configuration.messages.error.invalidDiscordId,
  ...ERROR_EMBED,
}) as const
export const SCAMMER_ALREADY_IN_LIST_EMBED = (name: string) => ({
  description: configuration.messages.error.scammerAlreadyInList.replace('%scammer%', name),
  ...ERROR_EMBED,
}) as const

export const SCAMMER_NOTIFICATION_EMBED = (name: string, {
  title, description,
}: { title: string, description: string }, id: string | null = null) => ({
  title,
  description: description?.replace('%scammer%', name),
  footer: id ? {
    text: id,
  } : undefined,
  ...INFO_EMBED,
}) as const

export const SCAMMER_ACTION_RESPONSE_EMBED = (name: string, {title, description}: {
  title: string,
  description: string
}) => ({
  title,
  description: description?.replace('%scammer%', name),
  ...SUCCESS_EMBED,
}) as const