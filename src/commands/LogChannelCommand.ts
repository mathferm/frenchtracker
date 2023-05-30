import { Discord, Slash, SlashGroup } from 'discordx'
import { CommandInteraction } from 'discord.js'
import { InteractionReplier, SUCCESS_EMBED } from '../utils/misc.js'
import { CANNOT_FIND_GUILD_EMBED, UNKNOWN_ERROR_EMBED } from '../utils/embeds.js'
import { setLogChannelForGuild } from '../database/GuildOptions.js'
import configuration from '../../configuration.js'

@Discord()
@SlashGroup({
  name: 'log-channel',
  nameLocalizations: {
    'en-US': 'log-channel',
    'en-GB': 'log-channel',
    'fr': 'salon-de-log',
  },
  description: 'Manage the log channel',
  descriptionLocalizations: {
    'en-US': 'Manage the log channel',
    'en-GB': 'Manage the log channel',
    'fr': 'Gérer le salon de log',
  },
  defaultMemberPermissions: 'ManageChannels',
})
export class LogChannelCommand {
  @SlashGroup('log-channel')
  @Slash({
    name: 'set',
    nameLocalizations: {
      'en-US': 'set',
      'en-GB': 'set',
      'fr': 'définir',
    },
    description: 'Set the log channel',
    descriptionLocalizations: {
      'en-US': 'Set the log channel',
      'en-GB': 'Set the log channel',
      'fr': 'Définir le salon de log',
    },
  })
  async set(interaction: CommandInteraction) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()

    if (!interaction.guild) {
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)
    }

    if (!interaction.channel)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)

    await setLogChannelForGuild(interaction.guild.id, interaction.channel.id)
    await replier.replyEmbed({
      description: configuration.messages.logChannel.set,
      ...SUCCESS_EMBED,
    })
  }

  @SlashGroup('log-channel')
  @Slash({
    name: 'unset',
    nameLocalizations: {
      'en-US': 'unset',
      'en-GB': 'unset',
      'fr': 'supprimer',
    },
    description: 'Unset the log channel',
    descriptionLocalizations: {
      'en-US': 'Unset the log channel',
      'en-GB': 'Unset the log channel',
      'fr': 'Supprimer le salon de log',
    },
  })
  async unset(interaction: CommandInteraction) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()

    if (!interaction.guild)
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)

    await setLogChannelForGuild(interaction.guild.id, null)
    await replier.replyEmbed({
      description: configuration.messages.logChannel.unset,
      ...SUCCESS_EMBED,
    })
  }
}