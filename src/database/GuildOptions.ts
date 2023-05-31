import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DATA_SOURCE } from './index.js'
import Scammer from './Scammer.js'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { ManualBanButton } from '../buttons/ManualBanButton.js'
import { banScammerFromGuild, getChannelForId, unBanScammerFromGuild } from '../utils/discord.js'
import { SCAMMER_NOTIFICATION_EMBED } from '../utils/embeds.js'
import configuration from '../../configuration.js'

@Entity()
export default class GuildOptions {
  @PrimaryColumn({type: 'varchar'})
  id!: string

  @Column({default: true})
  autoBan!: boolean

  @Column({nullable: true, type: 'varchar'})
  logChannelId?: string | null
}
export function getRepository() {
  return DATA_SOURCE.getRepository(GuildOptions)
}

export async function getGuildOptions(id: string) {
  return getRepository().findOne({where: {id}})
}

export async function createGuildOptions(id: string) {
  return getRepository().insert({id})
}

export async function deleteGuildOptions(id: string) {
  return getRepository().delete({id})
}

export async function toggleAutoBanForGuild(id: string) {
  await getRepository().update({id}, {autoBan: () => 'NOT autoBan'})

  return (await getRepository().findOne({where: {id}, select: ['autoBan']}))?.autoBan
}

export async function setLogChannelForGuild(id: string, logChannelId: string | null) {
  return getRepository().update({id}, {logChannelId})
}

export async function getLogChannelForGuild(client: Client<true>, id: string) {
  const channelId = (await getRepository().findOne({where: {id}, select: ['logChannelId']}))?.logChannelId

  if (!channelId) return null
  return await getChannelForId(client, channelId)
}

export async function notifyAllAdd(client: Client<true>, addedScammer: Scammer) {
  const guildOptions = await getRepository().find()
  const guilds = await client.guilds.fetch()

  for (const partialGuild of guilds.values()) {
    const guildOption = guildOptions.find(guildOption => guildOption.id === partialGuild.id)
    if (!guildOption) continue
    const logChannel = await getLogChannelForGuild(client, partialGuild.id)

    if (logChannel?.isTextBased())
      await logChannel.send({
        embeds: [SCAMMER_NOTIFICATION_EMBED(addedScammer.initialName, configuration.messages.notifications.scammerAdded, (!guildOption.autoBan ? addedScammer.discordId : null))],
        components: (!guildOption.autoBan ? [new ActionRowBuilder<ButtonBuilder>({
          components: [ManualBanButton.MANUAL_BAN_BUTTON],
        })] : []),
      })

    if (!guildOption.autoBan) continue
    await banScammerFromGuild(await partialGuild.fetch(), addedScammer)
  }
}

export async function notifyAllRemove(client: Client<true>, removedScammer: Scammer) {
  const guildOptions = await getRepository().find()
  const guilds = await client.guilds.fetch()

  for (const partialGuild of guilds.values()) {
    const guildOption = guildOptions.find(guildOption => guildOption.id === partialGuild.id)
    if (!guildOption) continue
    const logChannel = await getLogChannelForGuild(client, partialGuild.id)

    if (logChannel?.isTextBased())
      await logChannel.send({
        embeds: [SCAMMER_NOTIFICATION_EMBED(removedScammer.initialName, configuration.messages.notifications.scammerRemoved, (!guildOption.autoBan ? removedScammer.discordId : null))],
        components: (!guildOption.autoBan ? [new ActionRowBuilder<ButtonBuilder>({components: [ManualBanButton.MANUAL_UNBAN_BUTTON]})] : []),
      })

    if (!guildOption.autoBan) continue
    await unBanScammerFromGuild(await partialGuild.fetch(), removedScammer)
  }
}

export async function notifyAllForceRemove(client: Client<true>, removedScammer: Scammer) {
  const guildOptions = await getRepository().find()
  const guilds = await client.guilds.fetch()

  for (const partialGuild of guilds.values()) {
    const guildOption = guildOptions.find(guildOption => guildOption.id === partialGuild.id)
    if (!guildOption) continue
    const logChannel = await getLogChannelForGuild(client, partialGuild.id)

    if (logChannel?.isTextBased())
      await logChannel.send({
        embeds: [SCAMMER_NOTIFICATION_EMBED(removedScammer.initialName, configuration.messages.notifications.scammerForceRemoved)],
      })
    await unBanScammerFromGuild(await partialGuild.fetch(), removedScammer)
  }
}