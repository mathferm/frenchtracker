import { ArgsOf, Discord, On } from 'discordx'
import { createGuildOptions, deleteGuildOptions } from '../database/GuildOptions.js'

@Discord()
export class GuildEvents {
  @On({event: 'guildCreate'})
  async onBotJoinGuild([guild]: ArgsOf<'guildCreate'>) {
    console.log('Joined guild', guild.name)
    await createGuildOptions(guild.id).catch(() => null)
  }

  @On({event: 'guildDelete'})
  async onBotLeaveGuild([guild]: ArgsOf<'guildDelete'>) {
    console.log('Left guild', guild.name)
    await deleteGuildOptions(guild.id).catch(() => null)
  }
}