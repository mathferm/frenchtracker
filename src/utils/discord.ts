import { Client, Guild } from 'discord.js'
import Scammer from '../database/Scammer.js'
import configuration from '../../configuration.js'

export function dateToDiscordTimeStamp(date: Date, format: 'f' | 'F' | 'D' | 'd' | 'r' = 'f') {
  return `<t:${Math.floor(date.getTime() / 1000)}:${format}>`
}

export async function unBanScammerFromGuild(guild: Guild, scammer: Scammer): Promise<boolean> {
  return !!(await guild.bans.remove(scammer.discordId, configuration.messages.notifications.reasons.unban)
    .catch(error => {
      console.error(`Failed to unban ${scammer.initialName}/${scammer.discordId} (${scammer.uuid}) from ${guild.name}: ${error.message}`)
      return false
    }))
}

export async function banScammerFromGuild(guild: Guild, scammer: Scammer): Promise<boolean> {
  return !!(await guild.members.ban(scammer.discordId, {reason: configuration.messages.notifications.reasons.ban})
    .catch(error => {
      console.error(`Failed to ban ${scammer.initialName}/${scammer.discordId} (${scammer.uuid}) from ${guild.name}: ${error.message}`)
      return false
    }))
}

export async function getChannelForId(client: Client<true>, channelId: string) {
  return await client.channels.fetch(channelId)
}

export async function getGuildForId(client: Client<true>, guildId: string) {
  return await client.guilds.fetch(guildId)
}

export async function getRoleForId(guild: Guild, roleId: string) {
  return await guild.roles.fetch(roleId)
}

export async function getMemberForId(guild: Guild, memberId: string) {
  return await guild.members.fetch(memberId)
}