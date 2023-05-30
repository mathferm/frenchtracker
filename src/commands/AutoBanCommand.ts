import { Discord, Slash, SlashGroup } from 'discordx'
import { CommandInteraction } from 'discord.js'
import { toggleAutoBanForGuild } from '../database/GuildOptions.js'
import configuration from '../../configuration.js'
import { InteractionReplier } from '../utils/misc.js'
import { CANNOT_FIND_GUILD_EMBED, INFO_EMBED } from '../utils/embeds.js'

@Discord()
@SlashGroup({
    name: 'auto-ban',
    nameLocalizations: {
      'en-US': 'auto-ban',
      'en-GB': 'auto-ban',
      'fr': 'auto-ban',
    },
    description: 'Auto-ban related commands',
    descriptionLocalizations: {
      'en-US': 'Auto-ban related commands',
      'en-GB': 'Auto-ban related commands',
      'fr': 'Commandes liées à l\'auto-ban',
    },
    defaultMemberPermissions: 'Administrator',
  },
)
export class AutoBanCommand {
  @SlashGroup('auto-ban')
  @Slash({
    name: 'toggle',
    nameLocalizations: {
      'en-US': 'toggle',
      'en-GB': 'toggle',
      'fr': 'toggle',
    },
    description: 'Toggle auto-ban',
    descriptionLocalizations: {
      'en-US': 'Toggles auto-ban',
      'en-GB': 'Toggles auto-ban',
      'fr': 'Active ou désactive l\'auto-ban',
    },
    defaultMemberPermissions: 'Administrator',
  })
  async toggle(interaction: CommandInteraction) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()

    if (!interaction.guild)
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)

    return await replier.replyEmbed(await toggleAutoBanForGuild(interaction.guild.id) ? {
      description: configuration.messages.autoBan.enabled,
      ...INFO_EMBED,
    } : {
      description: configuration.messages.autoBan.disabled,
      ...INFO_EMBED,
    })
  }
}